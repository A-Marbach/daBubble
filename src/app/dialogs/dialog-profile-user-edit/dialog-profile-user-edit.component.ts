import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from '../../services/firebase.service';
import { UserService } from '../../services/user.service';
import { User } from '../../../models/user.class';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-dialog-profile-user-edit',
  standalone: true,
  imports: [
    MatCard,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './dialog-profile-user-edit.component.html',
  styleUrl: './dialog-profile-user-edit.component.scss'
})
export class DialogProfileUserEditComponent implements OnInit {

  imgSrc: string = "assets/img/close_default.svg";
  user: User = {
    name: 'Frederick Beck',
    email: 'Test@gmx.de',
    id: '',
    img: 'assets/img/profiles/boy.png',
    password: '',
    channels: [],
    chats: [],
    state: 'offline',
    lastChanged: Date.now(),
    usersToJSON: function (): { name: string; email: string; id: string; img: string; password: string; channels: string[]; chats: string[]; } {
      throw new Error('Function not implemented.');
    }
  };
  name: string = "";
  email: string = "";
  userID: string = "";
  emailInvalid = false;

  constructor(
    public dialog: MatDialogRef<DialogProfileUserEditComponent>,
    private fire: FirebaseService,
    public userService: UserService,
  ) {
  }

  closeDialog() {
    this.dialog.close();
  }

  async ngOnInit(): Promise<void> {
    try {
      const uid = await this.fire.getCurrentUserUid();
      if (uid) {
        await this.userService.loadUserById(uid);
        const user = this.userService.getUser();
        if (user) {
          this.user = user;
          this.userID = uid
        }
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzerdaten:', error);
    }
  }

  async saveData() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = this.email.length > 0 ? emailPattern.test(this.email) : true;

    if ((this.email.length > 0 && isEmailValid) || this.name.length > 0) {
      if (this.userID) {
        await this.fire.updateUserData(this.userID, this.name, this.email);
      }
    } else {
      console.error('Invalid email format');
    }
    this.dialog.close();
  }

  checkEmailName() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = this.email.length > 0 ? emailPattern.test(this.email) : true;

    if (this.email.length > 0 && isEmailValid) {
      this.emailInvalid = false;
    }
    else {
      this.emailInvalid = true;
    }
  }

  markAsTouched(control: NgModel) {
    control.control.markAsTouched();
    control.control.updateValueAndValidity();
  }

}
