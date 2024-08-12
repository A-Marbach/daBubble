import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-channel-members',
  standalone: true,
  imports: [
    MatCard,

  ],
  templateUrl: './dialog-channel-members.component.html',
  styleUrl: './dialog-channel-members.component.scss'
})
export class DialogChannelMembersComponent {

  imgSrc: string = "assets/img/close_default.png";

  constructor( public dialog: MatDialogRef<DialogChannelMembersComponent> ) {    
  }


  closeDialog(){
    this.dialog.close();
  }
}
