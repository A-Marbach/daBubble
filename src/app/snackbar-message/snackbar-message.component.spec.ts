import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarMessageComponent } from './snackbar-message.component';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from '../services/user.service';

describe('SnackbarMessageComponent', () => {
  let component: SnackbarMessageComponent;
  let fixture: ComponentFixture<SnackbarMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarMessageComponent],
      providers: [
        {
          provide: MatSnackBarRef,
          useValue: { dismiss: jasmine.createSpy('dismiss') }
        },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: { message: 'Test message' }
        },
        // Firestore Mock
        {
          provide: Firestore,
          useValue: {} // leeres Mock reicht
        },
        // UserService Mock
        {
          provide: UserService,
          useValue: {
            getUser: () => ({ id: 'mock', name: 'Mock', img: '' }),
            updateUser: () => Promise.resolve()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
