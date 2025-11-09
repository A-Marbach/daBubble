import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { FirebaseService } from '../services/firebase.service';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent],
      providers: [
        {
          provide: FirebaseService,
          useValue: {
            signUp: () => Promise.resolve() // stub Methode
          }
        },
        {
          provide: Auth,
          useValue: {} // leeres Mock
        },
        {
          provide: Firestore,
          useValue: {} // leeres Mock
        },
        {
          provide: UserService,
          useValue: {
            loadUserById: () => Promise.resolve(),
            getUser: () => null
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {}, queryParams: {} },
            params: of({}),
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
