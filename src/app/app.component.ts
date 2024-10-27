import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MainComponent } from './main/main.component';
import { GroupChatComponent } from './group-chat/group-chat.component';
import {} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SplashScreenComponent, RouterOutlet, MatCardModule, RouterLink, MainComponent, GroupChatComponent, HttpClientModule, AppComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'daBubble';
  constructor(private router: Router) { }

}
