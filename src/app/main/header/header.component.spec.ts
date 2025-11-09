import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { FirebaseService } from '../../services/firebase.service';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../../services/user.service';
import { Firestore } from '@angular/fire/firestore';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        {
          provide: FirebaseService,
          useValue: {
            getCurrentUserUid: () => Promise.resolve('mock-uid'),
            someOtherMethod: () => Promise.resolve()
          }
        },
        {
          provide: Auth,
          useValue: {
            signInWithEmailAndPassword: () => Promise.resolve(),
            createUserWithEmailAndPassword: () => Promise.resolve()
          }
        },
        {
          provide: UserService,
          useValue: {
            getUser: () => ({ id: 'mock-id', name: 'Mock User', img: '' }),
            loadUserById: () => Promise.resolve()
          }
        },
        {
          provide: Firestore,
          useValue: {} // leeres Objekt reicht
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
