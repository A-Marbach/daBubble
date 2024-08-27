import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.class';
import { UserService } from '../services/user.service';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-create-avatar',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './create-avatar.component.html',
  styleUrls: ['./create-avatar.component.scss']
})
export class CreateAvatarComponent implements OnInit {
  user!: User;
  auth: Auth = inject(Auth);
  firestore: Firestore = inject(Firestore);
  storage: Storage = inject(Storage);

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
    private userService: UserService
  ) {}

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
        console.warn('Keine Benutzerdaten gefunden!');
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
  
      // FileReader verwenden, um die Datei als Data URL zu lesen
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedAvatar = reader.result as string;
        this.user.img = this.selectedAvatar; // Setze das Bild auf das User-Objekt
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

    cleanedUserData.channels.push('1S28fQQEdf7LfxdJASzJ');
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.user.email, this.user.password);

      if (userCredential.user) {
        const uid = userCredential.user.uid;
        cleanedUserData.id = uid;

        if (this.selectedFile) {
          const filePath = `avatars/${uid}/${this.selectedFile.name}`;
          const fileRef = ref(this.storage, filePath);
          await uploadBytes(fileRef, this.selectedFile);
          
          const downloadURL = await getDownloadURL(fileRef);
          cleanedUserData.img = downloadURL;

          const docRef = doc(this.firestore, 'users', uid);
          await setDoc(docRef, cleanedUserData);

          console.log('User added with ID: ', uid);
        } else {
          const docRef = doc(this.firestore, 'users', uid);
          await setDoc(docRef, cleanedUserData);
          console.log('User added with ID: ', uid);
        }
      }
    } catch (e) {
      console.error('Error creating or updating user: ', e);
    }
  }
}
