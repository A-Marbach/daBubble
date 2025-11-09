import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginSectionComponent } from './login-section.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Firestore } from '@angular/fire/firestore';

describe('LoginSectionComponent', () => {
  let component: LoginSectionComponent;
  let fixture: ComponentFixture<LoginSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginSectionComponent,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },
            paramMap: { get: () => null }
          }
        },
        {
          provide: AuthService,
          useValue: {
            login: () => Promise.resolve(),
            logout: () => Promise.resolve()
          }
        },
        {
          provide: UserService,
          useValue: {
            getUser: () => ({ id: 'mockId', name: 'Mock User', img: '' }),
            loadUserById: () => Promise.resolve()
          }
        },
        {
          provide: Firestore,
          useValue: {} // leeres Objekt reicht für die Injection
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

