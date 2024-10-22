import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, DocumentData } from '@angular/fire/firestore';
import { UserCredential } from 'firebase/auth'; 
import { UserService } from '../services/user.service';
import { SplashScreenComponent } from '../splash-screen/splash-screen.component';
@Component({
  selector: 'app-login-section',
  standalone: true,
  imports: [MatCardModule, CommonModule, FormsModule, RouterModule, SplashScreenComponent], 
  templateUrl: './login-section.component.html',
  styleUrls: ['./login-section.component.scss'] 
})
export class LoginSectionComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isPasswordFocused: boolean = false;
  isEmailFocused: boolean = false;
  showSplash = true;

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {}

  



  async onLogin(): Promise<void> {
    if (this.email && this.password) {
      try {
        const userCredential = await this.authService.signIn(this.email, this.password);

        if (userCredential) {
          const uid = userCredential.user.uid;

          await this.userService.loadUserById(uid);

          this.router.navigate(['/main']);
        } else {
          this.errorMessage = 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.';
        }
      } catch (error) {
        this.errorMessage = 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.';
        console.error('Fehler beim Anmelden:', error);
      }
    } 
  }

  signInWithGoogle() {
    this.authService.googleSignIn()
      .then(() => {
        // console.log('Successfully signed in with Google and user data stored in Firestore');
        this.router.navigate(['/main']);
      })
      .catch((error) => {
        console.error('Google Sign-In failed:', error);
      });
  }

  signOut() {
    this.authService.googleSignOut()
      .then(() => {
        console.log('Successfully signed out');
      })
      .catch((error) => {
        console.error('Sign-Out failed:', error);
      });
  }

}

