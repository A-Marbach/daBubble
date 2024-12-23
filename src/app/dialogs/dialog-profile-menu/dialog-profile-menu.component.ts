import { Component, EventEmitter, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { DialogProfileUserComponent } from '../dialog-profile-user/dialog-profile-user.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-profile-menu',
  standalone: true,
  imports: [
    MatCardModule,
    MatMenuModule,
  ],
  templateUrl: './dialog-profile-menu.component.html',
  styleUrl: './dialog-profile-menu.component.scss'
})
export class DialogProfileMenuComponent {
  @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();
  constructor( 
    public dialog: MatDialogRef<DialogProfileMenuComponent>, 
    public dialogUser: MatDialog,
    private router: Router
  ) {    
  }

  openDialog(){
    let dialogRef = this.dialogUser.open(DialogProfileUserComponent, {
      backdropClass: 'custom-backdrop',
    });
  }

  logOut(){
    this.router.navigate(['/login']);
    this.dialog.close()
  }
}
