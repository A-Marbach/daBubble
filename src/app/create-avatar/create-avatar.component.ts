import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.class';
import { Channel } from '../../models/channel.class';
import { UserService } from '../services/user.service';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { UserCredential } from "firebase/auth";
@Component({
  selector: 'app-create-avatar',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './create-avatar.component.html',
  styleUrls: ['./create-avatar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class CreateAvatarComponent implements OnInit {
  user!: User;
  Channel!: Channel;
  auth: Auth = inject(Auth);
  firestore: Firestore = inject(Firestore);
  storage: Storage = inject(Storage);
  userCreated: boolean = false;
  avatars: string[] = [
    'assets/img/avatar-1.png',
    'assets/img/avatar-2.png',
    'assets/img/avatar-3.png',
    'assets/img/avatar-4.png',
    'assets/img/avatar-5.png',
    'assets/img/avatar-6.png'
  ];
  selectedAvatar: string = 'assets/img/person.png';
  selectedFile: File | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUser()!;
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.user = navigation.extras.state['user'] as User;
      if (this.user) {
        console.log('Benutzerdaten geladen:', this.user);
        if (this.user.img) {
          this.selectedAvatar = this.user.img;
        }
      } else {
        console.error('Keine Benutzerdaten gefunden!');
      }
    }
  }

  selectAvatar(avatarSrc: string): void {
    this.selectedAvatar = avatarSrc;
    this.user.img = avatarSrc;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedAvatar = reader.result as string;
        this.user.img = this.selectedAvatar;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  isFormValid(): boolean {
    return this.user.img.trim() !== '' || this.selectedFile !== null;
  }

  private cleanUserData(user: any): any {
    return {
      name: user.name || '',
      email: user.email || '',
      img: user.img || '',
      channels: user.channels || [],
      chats: user.chats || []
    };
  }

  async saveUser() {
    const cleanedUserData = this.cleanUserData(this.user);
    const channelId = '1iVN4yaalXYtrhS1QcXB';
    cleanedUserData.channels.push(channelId);
    this.userCreated = true;
    try {
      const userCredential = await this.createUser();
      if (userCredential) {
        await this.handleUserAvatar(userCredential.user.uid, cleanedUserData);
        await this.updateChannelUsers(userCredential.user.uid, channelId);
        await this.autoLogin(this.user.email, this.user.password);
      }
    } catch (error) {
      console.error('Error creating or updating user: ', error);
    }
  }

  private async createUser(): Promise<UserCredential | null> {
    try {
      return await createUserWithEmailAndPassword(this.auth, this.user.email, this.user.password);
    } catch (error) {
      console.error('Fehler beim Erstellen des Benutzers:', error);
      return null;
    }
  }

  private async handleUserAvatar(uid: string, cleanedUserData: any): Promise<void> {
    if (this.selectedFile) {
      const downloadURL = await this.uploadAvatar(uid, this.selectedFile);
      if (downloadURL) {
        cleanedUserData.img = downloadURL;
      }
    }
    await this.saveUserData(uid, cleanedUserData);
  }

  private async uploadAvatar(uid: string, file: File): Promise<string | null> {
    const filePath = `avatars/${uid}/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    try {
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Fehler beim Hochladen des Avatars:', error);
      return null;
    }
  }

  private async saveUserData(uid: string, cleanedUserData: any): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', uid);
    cleanedUserData.id = uid;
    await setDoc(userDocRef, cleanedUserData);
  }

  private async updateChannelUsers(uid: string, channelId: string): Promise<void> {
    const channelDocRef = doc(this.firestore, 'channels', channelId);
    const channelDocSnap = await getDoc(channelDocRef);
    if (channelDocSnap.exists()) {
      const channelData = channelDocSnap.data() as Channel;
      const userIds = channelData.users || [];
      if (!userIds.includes(uid)) {
        userIds.push(uid);
        await setDoc(channelDocRef, { users: userIds }, { merge: true });
      }
    } else {
      console.warn(`Channel with ID ${channelId} not found!`);
    }
  }

  private async autoLogin(email: string, password: string): Promise<void> {
    setTimeout(async () => {
      try {
        const loginCredential = await this.authService.signIn(email, password);
        if (loginCredential) {
          const uid = loginCredential.user.uid;
          await this.userService.loadUserById(uid);
          this.router.navigate(['/main']);
        } else {
          console.log('Automatische Anmeldung fehlgeschlagen. Bitte versuchen Sie es manuell.');
        }
      } catch (error) {
        console.log('Fehler beim automatischen Anmelden nach der Erstellung');
        console.error('Fehler beim automatischen Anmelden:', error);
      }
    }, 3000);
  }
}
