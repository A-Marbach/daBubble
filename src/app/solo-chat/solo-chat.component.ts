import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Firestore, doc, getDoc, onSnapshot } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Observable, of, from, Subscription } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';  // tap hinzugefügt
import { User } from '../../models/user.class';
import { ChatComponent } from '../chat/chat.component';
import { } from '@angular/common/http';
import { FirebaseService } from '../services/firebase.service';
import { arrayUnion, collection, DocumentReference, getDocs, setDoc, Timestamp, updateDoc, writeBatch } from 'firebase/firestore';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogProfileUserCenterComponent } from '../dialogs/dialog-profile-user-center/dialog-profile-user-center.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { HttpClientModule } from '@angular/common/http';

interface Chat {
  id: string;
  text: string;
  timestamp: Timestamp | string; 
  formattedTimestamp?: string;
  time: string;
  userName: string;
  userImage: string;
  userId: string;
  image: string;
  receivingUserId: string;
  isRead: boolean;
  smileys: { emoji: string; userNames: string[] }[];
}

@Component({
  selector: 'app-solo-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent, HttpClientModule, PickerModule],
  templateUrl: './solo-chat.component.html',
  styleUrls: ['./solo-chat.component.scss'],
  providers: [DatePipe]
})
export class SoloChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('scrollingContainer', { static: false }) scrollContainer!: ElementRef;
  user$: Observable<User | undefined> = of(undefined);
  user: User | null = null;
  loggedInUserName!: string;
  loggedInUserId!: string;
  userName!: string;
  chats: Chat[] = [];
  isChatBlinking: boolean = false;
  userImages = [];
  channelId = 'pEylXqZMW1zKPIC0VDXL'
  supportsTouch: boolean = false;
  isMobile: boolean = false;
  imgSrc = ['assets/img/smiley/add_reaction.svg', 'assets/img/smiley/comment.svg', 'assets/person_add.svg', 'assets/more_vert.svg'];
  showSmileyPicker = false;
  private chatsSubscription: Subscription | null = null;
  private chatListenerUnsubscribe: (() => void) | null = null;
  activeChatIndex: number | null = null;
  messageId: string | null = null;
  currentUser: { name: string } | null = null;

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private dialogProfile: MatDialog,
  ) { }

  async ngOnInit(): Promise<void> {
    this.initializeUserObservable();
    await this.initializeLoggedInUser();
    this.supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (this.supportsTouch && window.innerWidth < 992) {
      this.isMobile = true;
    }
  }

  private initializeUserObservable(): void {
    this.user$ = this.userService.selectedUserId$.pipe(
      switchMap(userId =>
        this.handleUserSelection(userId)
      ),
      catchError(error => {
        return of(undefined);
      })
    );
  }

  private handleUserSelection(userId: string | null): Observable<User | undefined> {
    if (userId) {
      return this.loadUserAndListen(userId);
    } else {
      const lastSelectedUserId = this.userService.getLastSelectedUserId();
      if (lastSelectedUserId) {
        return this.loadUserAndListen(lastSelectedUserId);
      } else {
        return of(undefined);
      }
    }
  }

  private loadUserAndListen(userId: string): Observable<User | undefined> {
    return this.loadUserData(userId).pipe(
      tap(user => {
        if (user) {
          this.listenToChats(user.id);
        }
      })
    );
  }

  async initializeLoggedInUser(): Promise<void> {
    try {
      const uid = await this.firebaseService.getCurrentUserUid();
      if (uid) {
        this.loggedInUserId = uid;
        await this.userService.loadUserById(uid);
        this.user = this.userService.getUser();
        if (this.user) {
          this.loggedInUserName = this.user.name;
        }
      }
    } catch (error) {
    }
  }

  loadUserData(userId: string | null): Observable<User | undefined> {
    if (!userId) {
      return of(undefined);
    }

    const userDoc = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userDoc)).pipe(
      map(userSnapshot => {
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          return new User(
            userData['name'] || '',
            userData['email'] || '',
            userId,
            userData['img'] || '',
            userData['password'] || '',
            userData['receivingId']
          );
        } else {
          return undefined;
        }
      }),
      catchError(error => {
        return of(undefined);
      })
    );
  }

  listenToChats(userId: string): void {
    if (!this.loggedInUserId || !userId) {
      return;
    }

    const chatId = this.createChatId(this.loggedInUserId, userId);
    const messagesCollectionRef = collection(this.firestore, `chats/${chatId}/messages`);
    this.chatListenerUnsubscribe = onSnapshot(messagesCollectionRef, (snapshot) => {
      if (!snapshot.empty) {
        const retrievedMessages = snapshot.docs.map(doc => doc.data());
        this.chats = this.formatMessages(retrievedMessages);
        const hasUnread = retrievedMessages.some(message => !message['isRead'] && message['receivingUserId'] === this.loggedInUserId);
        this.isChatBlinking = hasUnread;

      } else {
        this.chats = [];
        this.isChatBlinking = false;
      }
    }, (error) => {
    });
  }

  createChatId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('_');
  }

  getUserIdFromUrl(): string | null {
    const userId = this.route.snapshot.params['id'];
    if (userId) {
      return userId;
    } else {
      return null;
    }
  }

  formatMessageTime(timestamp: any): string {
    const date = timestamp.toDate();
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatMessages(messages: any[]): Chat[] {
    const sortedMessages = messages.sort((a, b) => {
      return a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime();
    });

    return sortedMessages.map(message => {
      return {
        ...message,
        timestamp: this.formatTimestamp(message.timestamp),
        time: this.formatMessageTime(message.timestamp),
        isRead: message.isRead,
        userImage: message.userImage || '',
        userId: message.userId,
        userName: message.userName
      } as Chat;
    });
  }

  formatTimestamp(timestamp: any): string {
    const date = timestamp.toDate();
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return 'Heute';
    } else {
      return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }

  async markMessagesAsRead(chatId: string, userId: string) {
    this.scrollToBottom();
    const messagesCollectionRef = collection(this.firestore, `chats/${chatId}/messages`);
    const snapshot = await getDocs(messagesCollectionRef);
    this.scrollToBottom();
    const batch = writeBatch(this.firestore);
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data['receivingUserId'] === userId && !data['isRead']) {
        batch.update(doc.ref, { isRead: true });
      }
    });
    try {
      await batch.commit();
    } catch (error) {
    }
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  ngOnDestroy(): void {
    if (this.chatsSubscription) {
      this.chatsSubscription.unsubscribe();
    }
    if (this.chatListenerUnsubscribe) {
      this.chatListenerUnsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.observeMutations();
  }

  observeMutations(): void {
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(() => {
      this.scrollToBottom();
    });
    observer.observe(this.scrollContainer.nativeElement, config);
  }

  openDialogMemberProfile(user: User) {
    this.dialogProfile.open(DialogProfileUserCenterComponent, {
      panelClass: 'border-30-right',
      data: {
        username: user.name,
        email: user.email,
        image: user.img,
        user: user,
        status: this.userService.getUserStatus(user.id)
      }
    });
  }

  changeImageSmiley(isHover: boolean) {
    this.imgSrc[0] = isHover ? 'assets/img/smiley/add_reaction-blue.svg' : 'assets/img/smiley/add_reaction.svg';
  }

  openSmiley(chatIndex: number) {
    const chat = this.chats[chatIndex];
    if (!chat) {
      console.warn('Kein Chat gefunden für Index:', chatIndex);
      return;
    }

    if (this.activeChatIndex === chatIndex) {
      this.activeChatIndex = null;
    } else {
      this.activeChatIndex = chatIndex;
    }
    this.onChatClick(chat);
  }

  addSmiley(event: any) {
    const selectedEmoji = event.emoji.native;
    if (this.messageId) {
      const selectedChat = this.chats[this.activeChatIndex!];
      if (selectedChat) {
        this.saveSmiley(selectedEmoji, selectedChat, this.messageId);
      } else {
        console.warn('Kein Chat gefunden für activeChatIndex:', this.activeChatIndex);
      }
    } else {
      console.warn('Keine messageId gefunden. Emoji kann nicht gespeichert werden.');
    }
    this.activeChatIndex = null;
  }

  saveSmiley(emoji: string, chat: Chat, messageId: string) {
    if (!this.validateUserAndMessageId()) return;
    const chatId = this.firebaseService.createChatId(chat.userId, chat.receivingUserId);
    if (!chatId) {
      console.warn('Ungültige Chat-ID.');
      return;
    }
    const messageDocRef = this.getMessageDocRef(chatId, messageId);
    if (!messageDocRef) {
      console.warn('Dokumentenreferenz konnte nicht gefunden werden.');
      return;
    }
    this.fetchMessageDocAndProcessSmiley(messageDocRef, emoji);
  }

  private fetchMessageDocAndProcessSmiley(messageDocRef: DocumentReference, emoji: string) {
    getDoc(messageDocRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const messageData = docSnapshot.data() || {};
        const currentSmileys = messageData['smileys'] || [];
        const updatedSmileys = this.processSmileyList(currentSmileys, emoji);
        this.updateSmileyInDatabase(messageDocRef, updatedSmileys);
      } else {
        console.warn('Nachricht nicht gefunden für:', messageDocRef.id);
      }
    }).catch((error) => {
      console.error('Fehler beim Abrufen der Nachricht:', error);
    });
  }

  private processSmileyList(currentSmileys: any[], emoji: string): any[] {
    const userName = this.loggedInUserName;
    const smileyIndex = currentSmileys.findIndex(smiley => smiley.emoji === emoji);
    if (smileyIndex > -1) {
      const userIndex = currentSmileys[smileyIndex].userNames.indexOf(userName);
      if (userIndex > -1) {
        currentSmileys[smileyIndex].userNames.splice(userIndex, 1);
        if (currentSmileys[smileyIndex].userNames.length === 0) {
          currentSmileys.splice(smileyIndex, 1);
        }
      } else {
        currentSmileys[smileyIndex].userNames.push(userName);
      }
    } else {
      currentSmileys.push({ emoji, userNames: [userName] });
    }
    return currentSmileys;
  }

  private updateSmileyInDatabase(messageDocRef: DocumentReference, updatedSmileys: any[]) {
    updateDoc(messageDocRef, { smileys: updatedSmileys })
      .then(() => {
      })
      .catch((error) => {
        console.error('Fehler beim Speichern des Smileys:', error);
      });
  }

  private validateUserAndMessageId(): boolean {
    if (!this.user) {
      console.warn('User not available.');
      return false;
    }
    return true;
  }

  getMessageDocRef(chatId: string, messageId: string) {
    const messageDocRef = doc(this.firestore, `chats/${chatId}/messages/${messageId}`);
    return messageDocRef;
  }

  updateMessageWithSmiley(messageDocRef: DocumentReference, emoji: string) {
    updateDoc(messageDocRef, {
      smileys: arrayUnion({ emoji, userNames: [this.user?.name] })
    })
      .then(() => {
      })
      .catch((error) => {
        console.error('Fehler beim Speichern des Smileys:', error);
      });
  }

  onChatClick(chat: Chat): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.user) {
        console.warn('User is not available.');
        reject('User not available');
        return;
      }

      const chatId = this.firebaseService.createChatId(chat.userId, chat.receivingUserId);
      this.checkMessageId(chatId, chat.text)
        .then(() => resolve())
        .catch(() => {
          const reverseChatId = this.firebaseService.createChatId(chat.receivingUserId, chat.userId);
          this.checkMessageId(reverseChatId, chat.text)
            .then(() => resolve())
            .catch((error) => reject(error));
        });
    });
  }

  private checkMessageId(chatId: string, chatText: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fetchMessageId(chatId, chatText).then(() => {
        if (this.messageId) {
          resolve();
        } else {
          console.warn('Keine messageId für den Text gefunden:', chatText);
          reject('messageId not found');
        }
      }).catch((error) => {
        console.error('Fehler beim Abrufen der Nachricht:', error);
        reject(error);
      });
    });
  }

  fetchMessageId(chatId: string, messageText: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const chatDocRef = doc(this.firestore, 'chats', chatId);
      getDocs(collection(chatDocRef, 'messages')).then((querySnapshot) => {
        let found = false;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data['text'].trim() === messageText.trim()) {
            this.messageId = doc.id;
            found = true;
          }
        });
        if (found) {
          resolve();
        } else {
          console.warn('Keine messageId gefunden für den Text:', messageText, 'bei Chat ID:', chatId);
          reject('messageId not found');
        }
      }).catch((error) => {
        console.error('Fehler beim Abrufen der Nachrichten:', error);
        reject(error);
      });
    });
  }

  getChatDocRef(chatId: string) {
    return doc(this.firestore, 'chats', chatId);
  }

  getActiveChat(): Chat | null {
    if (this.activeChatIndex === null || this.activeChatIndex < 0 || this.activeChatIndex >= this.chats.length) {
      return null;
    }
    return this.chats[this.activeChatIndex];
  }

  isUserReacted(smiley: { emoji: string; userNames: string[] }): string {
    if (!smiley || !smiley.userNames) return '';
    const hasReacted = smiley.userNames.includes(this.loggedInUserName);
    const otherUsers = smiley.userNames.filter(userName => userName !== this.loggedInUserName);
    if (hasReacted && otherUsers.length > 0) {
      return `${otherUsers.join(', ')} und Du haben reagiert`;
    } else if (hasReacted) {
      return 'Du hast reagiert';
    } else if (otherUsers.length > 0) {
      return `${otherUsers.join(', ')} hat reagiert`;
    }

    return '';
  }

  async toggleSmiley(smiley: { emoji: string; userNames: string[] }, chat: Chat) {
    try {
      await this.onChatClick(chat);
      if (!this.messageId) {
        console.warn('Keine messageId gefunden, kann nicht speichern.');
        return;
      }
      this.processSmileyUpdate(smiley, chat, this.messageId);
    } catch (error) {
      console.error('Fehler bei toggleSmiley:', error);
    }
  }

  private processSmileyUpdate(smiley: { emoji: string; userNames: string[] }, chat: Chat, messageId: string) {
    const userName = this.getCurrentUserName();
    const smileyIndex = chat.smileys.findIndex(s => s.emoji === smiley.emoji);

    if (smileyIndex !== -1) {
      const userNames = chat.smileys[smileyIndex].userNames;
      const userIndex = userNames.indexOf(userName);
      if (userIndex !== -1) {
        userNames.splice(userIndex, 1);
      } else {
        userNames.push(userName);
      }
      this.saveSmiley(smiley.emoji, chat, messageId);
    } else {
      console.warn('Kein passender Smiley gefunden, Smiley kann nicht aktualisiert werden.');
    }
  }

  getCurrentUserName(): string {
    return this.currentUser ? this.currentUser.name : '';
  }
}
