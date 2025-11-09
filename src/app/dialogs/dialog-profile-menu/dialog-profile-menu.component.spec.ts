import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogProfileMenuComponent } from './dialog-profile-menu.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from '../../services/firebase.service';
import { Auth } from '@angular/fire/auth';

describe('DialogProfileMenuComponent', () => {
  let component: DialogProfileMenuComponent;
  let fixture: ComponentFixture<DialogProfileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogProfileMenuComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: FirebaseService,
          useValue: {
            someMethod: () => Promise.resolve() // stub für Methoden, die dein Component nutzt
          }
        },
        {
          provide: Auth,
          useValue: {
            signInWithEmailAndPassword: () => Promise.resolve(),
            createUserWithEmailAndPassword: () => Promise.resolve()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
