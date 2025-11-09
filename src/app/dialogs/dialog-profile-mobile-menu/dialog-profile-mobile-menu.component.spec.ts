import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogProfileMobileMenuComponent } from './dialog-profile-mobile-menu.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from '../../services/firebase.service';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

describe('DialogProfileMobileMenuComponent', () => {
  let component: DialogProfileMobileMenuComponent;
  let fixture: ComponentFixture<DialogProfileMobileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogProfileMobileMenuComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: FirebaseService,
          useValue: { someMethod: () => Promise.resolve() }
        },
        {
          provide: Auth,
          useValue: {
            signInWithEmailAndPassword: () => Promise.resolve(),
            createUserWithEmailAndPassword: () => Promise.resolve()
          }
        },
        {
          provide: Firestore,
          useValue: {
            collection: () => ({
              doc: () => ({
                set: () => Promise.resolve(),
                update: () => Promise.resolve(),
                get: () => Promise.resolve({ exists: true, data: () => ({}) })
              }),
              get: () => Promise.resolve([])
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogProfileMobileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
