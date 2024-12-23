import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { User } from '../../models/user.class';
import { UserService } from '../services/user.service';
import { addDoc, arrayUnion, collection, doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { GroupChatComponent } from '../group-chat/group-chat.component';
import { CommonModule } from '@angular/common';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../models/channel.class';

export interface ChatMessage {
  text: string;
  timestamp: Timestamp;
  time: any;
  userName: string;
  userId: string;
  receivingUserId: string;
  isRead?: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, PickerComponent, MatMenuModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('messageInput') messageInput: any;
  @ViewChild('messageInput') messageInputRef!: ElementRef;
  @ViewChild('myTextarea') myTextarea!: ElementRef;
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  @ViewChild('menuTriggerChannel') menuTriggerChannel!: MatMenuTrigger;

  ngAfterViewInit() {
    setTimeout(() => {
      this.messageInputRef.nativeElement.focus();
    }, 500);
  }

  @Output() notify: EventEmitter<void> = new EventEmitter<void>();
  @Output() sendChatMessage: EventEmitter<void> = new EventEmitter<void>();
  imgTextarea = ['assets/add.svg', 'assets/img/smiley/sentiment_satisfied.svg', 'assets/img/smiley/alternate_email.svg', 'assets/img/smiley/send.svg'];
  channelId: string = '';
  messages: string[] = [];
  messageIds: string[] = [];
  messageContent = "";
  smileys: { emoji: string; userName: string }[] = [];
  @Input() groupId: string | null = null;
  @Input() answerId: string | null = null; placeholderText: string = 'Nachricht an #Gruppenname';
  user: User | null = null;
  receivingUserId: string | null = null;
  private messagesSubscription: Subscription | null = null;
  private routeSubscription: Subscription | null = null;
  userService: UserService;
  userName!: string;
  storage: Storage = inject(Storage);
  selectUsers: User[] = []
  selectChannels: Channel[] = []
  selectedFile: File | null = null;
  selectedImageUrl: string | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  showEmojiPicker = false;
  isImageSelected: boolean = false;
  channelTag = 'assets/tag.svg'

  constructor(
    private fireService: FirebaseService,
    private route: ActivatedRoute,
    userService: UserService,
    private firestore: Firestore,
    private elementRef: ElementRef,
    private router: Router) {
    this.userService = userService;
    this.fireService.getUsersData().subscribe((list) => {
      this.selectUsers = list.map(element => {
        const data = element;
        return new User(
          data['name'] || '',
          data['email'] || '',
          data['id'] || '',
          data['img'] || '',
          data['password'] || '',
          data['channels'] || [],
          data['chats'] || []
        );
      });
    });
    this.fireService.getChannelsData().subscribe((list) => {
      this.selectChannels = list.map(element => {
        const data = element;
        return new Channel(
          data['name'] || '',
          data['description'] || '',
          data['creator'] || '',
          data['messages'] || [],
          data['users'] || [],
          data['id'] || '',
        );
      });
    });
  }
  @Output() clickOutside: EventEmitter<null> = new EventEmitter<null>();
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    // console.log(targetElement)
    // console.log(clickedInside)
    if (!clickedInside) {
      if (this.showEmojiPicker) {
        this.showEmojiPicker = false;
      }
    }
  }

  addUserOrChannelToInput(inputName: string, type: string) {
    let name = ''
    if (type == 'channel') {
      name = inputName;
    }
    if (type == 'user') {
      name = inputName;
    }
    const textarea = this.messageInput.nativeElement;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    this.messages.push(textarea.value.substring(0, startPos) + name + textarea.value.substring(endPos));
    const finalMessage = this.messages.join('');
    textarea.value = finalMessage;
    textarea.setSelectionRange(startPos + name.length, startPos + name.length);
    this.messages = []
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    if (value.endsWith('@')) {
      this.menuTrigger.openMenu();
    } else if (value.endsWith('#')) {
      this.menuTriggerChannel.openMenu();
    }
    else {
      this.menuTrigger.closeMenu();
      this.menuTriggerChannel.closeMenu();
    }
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const emoji = event.emoji.native;
    const textarea = this.messageInput.nativeElement;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    this.messages = textarea.value.substring(0, startPos) + emoji + textarea.value.substring(endPos);
    textarea.value = this.messages;
    textarea.setSelectionRange(startPos + emoji.length, startPos + emoji.length);
    this.showEmojiPicker = false;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImageUrl = e.target?.result as string;
        this.isImageSelected = true;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.selectedImageUrl = null;
    this.isImageSelected = false;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.messageInputRef.nativeElement.focus();
        }, 50);
      }
    });

    this.routeSubscription = this.route.params.subscribe(params => {
      const id = params['id'];
      this.answerId = params['answerId'];
      this.loadCurrentUser();
      if (this.answerId) {
        this.placeholderText = 'Antworten';
      } else if (id) {
        this.channelId = id;
        if (this.channelId) {
          this.loadDataBasedOnId(id);
        } else {
          console.error('channelId ist nicht definiert nach dem Setzen der ID:', id);
        }
      }
    });
  }

  async loadCurrentUser() {
    try {
      const uid = await this.fireService.getCurrentUserUid();
      if (uid) {
        await this.userService.loadUserById(uid);
        this.user = this.userService.getUser();
        if (this.user) {
          this.userName = this.user.name;
        }
      } else {
      }
    } catch (error) {
    }
  }

  private async loadDataBasedOnId(id: string): Promise<void> {
    try {
      const channel = await this.fireService.getChannelById(id);
      if (channel) {
        this.placeholderText = `Nachricht an #${channel.name}`;
      } else {
        const user = await this.fireService.getUserById(id);
        if (user) {
          this.placeholderText = `Nachricht an ${user.name}`;
        }
      }
    } catch (error) {
    }
  }

  sendMessageToUser(messageText: string, receivingUserId: string, smileys: { emoji: string; userName: string }[]): void {
    if (!this.user) {
      console.warn('Benutzer nicht verfügbar.');
      return;
    }
    const chatId = this.fireService.createChatId(this.user.id, receivingUserId);
    const message = {
      text: messageText,
      timestamp: Timestamp.now(),
      userName: this.user.name,
      userId: this.user.id,
      receivingUserId: receivingUserId,
      time: new Date().toLocaleTimeString(),
      isRead: false,
      userImage: this.user.img,
      smileys: smileys
    };
    if (chatId) {
      const chatDocRef = doc(this.firestore, 'chats', chatId);
      setDoc(chatDocRef, { messages: [] }, { merge: true })
        .then(() => {
          addDoc(collection(chatDocRef, 'messages'), message)
            .catch(error => console.error('Error sending message:', error));
        })
        .catch(error => console.error('Error creating chat document:', error));
    } else {
      console.warn('Ungültige Chat-ID.');
    }
  }

  async giveTheIdFromMessages() {
    const messagesCollectionRef = collection(this.firestore, 'channels', this.channelId, 'messages');
    collectionData(messagesCollectionRef, { idField: 'id' }).subscribe((messages: any[]) => {
      this.messageIds = messages.map(message => message.id);
    }, (error: any) => {
    });
  }

  async sendMessage(messageText: string): Promise<void> {
    this.sendChatMessage.emit()
    if (!this.user) {
      console.error('Kein Benutzer vorhanden');
      return;
    }
    if (!this.isMessageValid(messageText) && !this.selectedFile) {
      console.error('Nachricht oder Bild ist nicht gültig');
      return;
    }
    const receivingUserId = this.getReceivingUserIdFromUrl() || this.answerId || this.receivingUserId;
    if (!receivingUserId) {
      console.error('Empfänger-ID nicht vorhanden');
      return;
    }
    let imageUrl = null;
    if (this.selectedFile) {
      const filePath = `avatars/${this.user.id}/${this.selectedFile.name}`;
      const fileRef = ref(this.storage, filePath);
      try {
        await uploadBytes(fileRef, this.selectedFile);
        imageUrl = await getDownloadURL(fileRef);
      } catch (error) {
        console.error('Fehler beim Hochladen des Bildes:', error);
        return;
      }
    }
    const message = this.createMessage(messageText, receivingUserId, imageUrl);
    if (this.answerId) {
      this.saveMessageToAnswers(this.answerId, message);
    }
    this.sendMessageToUser(message.text, receivingUserId, this.smileys);
    if (this.channelId) { // Dies bedeutet, dass channelId nicht leer ist
      this.checkIfUserAndSendMessage(message, this.messageInputRef.nativeElement);
    }
    this.notify.emit();
    this.messageContent = "";
  }

  private createMessage(messageText: string, receivingUserId: string, imageUrl: string | null): any {
    if (!this.user) {
      console.error('User is not defined');
      return null;
    }
    return {
      text: messageText || '',
      timestamp: Timestamp.now(),
      userName: this.userName || 'Gast',
      userId: this.user.id,
      receivingUserId: receivingUserId,
      time: new Date().toLocaleTimeString(),
      chats: [],
      image: imageUrl,
      isRead: false,
      userImage: this.user.img,
    };
  }

  private async saveMessageToAnswers(answerId: string, message: any): Promise<void> {
    try {
      const chatDocRef = doc(this.firestore, `channels/${this.groupId}/messages/${answerId}`);
      await updateDoc(chatDocRef, {
        chats: arrayUnion(message)
      });
    } catch (error) {
    }
    this.clearMessageInputAndScroll(this.messageInputRef.nativeElement);
  }

  private async checkIfUserAndSendMessage(message: any, messageInput: HTMLTextAreaElement): Promise<void> {
    try {
      if (!this.channelId) {
        throw new Error('channelId ist nicht definiert');
      }
      const userDocRef = doc(this.firestore, 'users', this.channelId);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
      } else {
        await this.saveMessageToChannels(message, messageInput);
      }
    } catch (error) {
      console.error(error)
    }
  }

  async saveMessageToChannels(message: any, messageInput: HTMLTextAreaElement): Promise<void> {
    const messagesRef = collection(this.firestore, `channels/${this.channelId}/messages`);
    addDoc(messagesRef, message)
      .then(() => {
        this.clearMessageInputAndScroll(messageInput);
      })
      .catch((error) => {
      });
  }

  prepareMessage(messageText: string) {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      text: messageText,
      userName: this.user?.name || 'Unknown User',
      userId: this.user?.id || 'Unknown UserId',
      timestamp: Timestamp.fromDate(now),
      time: formattedTime,
      receivinguserId: this.channelId,
    };
  }

  getReceivingUserId(): string | null {
    const receivingUserId = this.route.snapshot.queryParams['receiverId'];
    if (receivingUserId) {
      return receivingUserId;
    } else {
      console.error('Keine Empfänger-ID in der URL gefunden.');
      return null;
    }
  }

  getReceivingUserIdFromUrl(): string | null {
    const receivingUserId = this.route.snapshot.paramMap.get('id');
    return receivingUserId;
  }

  async sendMessageToFirestore(message: any): Promise<void> {
    return this.fireService.addMessageToFirestore(this.channelId, message).then(() => {
    }).catch((error) => {
      console.error('failed to send message to firestore', error)
    });
  }

  validateMessageInput(messageText: string): boolean {
    return messageText.trim() !== '' && !!this.channelId;
  }

  handleKeyDown(event: KeyboardEvent, messageInput: HTMLTextAreaElement): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const messageText = messageInput.value.trim();
      if (messageText.length > 0) {
        this.sendMessage(messageText);
      }
    }
  }

  private isMessageValid(messageText: string): boolean {
    const trimmedMessageText = messageText.trim();
    return trimmedMessageText.length > 0;
  }

  private clearMessageInputAndScroll(messageInput: HTMLTextAreaElement): void {
    messageInput.value = '';
    this.removeImage();
  }

  changeAdd(isHover: boolean, event?: MouseEvent): void {
    this.imgTextarea[0] = isHover ? 'assets/add-hover-blue.svg' : 'assets/add.svg';

    if (event && event.type === 'click') {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  }

  addSmiley(isHover: boolean) {
    this.imgTextarea[1] = isHover ? 'assets/img/smiley/sentiment_satisfied-blue.svg' : 'assets/img/smiley/sentiment_satisfied.svg';
  }
  addEmailContact(isHover: boolean) {
    this.imgTextarea[2] = isHover ? 'assets/img/smiley/alternate_email-blue.svg' : 'assets/img/smiley/alternate_email.svg';
  }
  sendNews(isHover: boolean) {
    this.imgTextarea[3] = isHover ? 'assets/img/smiley/send-light-blue.svg' : 'assets/img/smiley/send.svg';
  }

  ngOnDestroy(): void {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}