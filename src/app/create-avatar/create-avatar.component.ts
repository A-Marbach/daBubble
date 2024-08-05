import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.class';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-create-avatar',
  standalone: true,
  imports: [RouterOutlet, RouterModule, LoginComponent, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './create-avatar.component.html',
  styleUrl: './create-avatar.component.scss'
})
export class CreateAvatarComponent {
  user!: User;
  avatars: string[] = [
    'assets/img/avatar-1.png',
    'assets/img/avatar-2.png',
    'assets/img/avatar-3.png',
    'assets/img/avatar-4.png',
    'assets/img/avatar-5.png',
    'assets/img/avatar-6.png'
  ];

  selectedAvatar: string = 'assets/img/person.png';
  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getUser()!;
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.user = navigation.extras.state['user'] as User;

      if (this.user) {
        console.log('Benutzerdaten geladen:', this.user);
        // Optional: Setze das Avatar-Bild, falls das bereits festgelegt wurde
        if (this.user.photo) {
          this.selectedAvatar = this.user.photo;
        }
      } else {
        console.warn('Keine Benutzerdaten gefunden!');
      }
    }
  }

  selectAvatar(avatarSrc: string): void {
    this.selectedAvatar = avatarSrc;
    this.user.photo = avatarSrc;
  }
  selectedFile: File | null = null;

 
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // FileReader verwenden, um die Datei als Data URL zu lesen
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedAvatar = reader.result as string; // Setze die geladene Data URL als Avatar
      };
      reader.readAsDataURL(file);
    }
  }

 
}


