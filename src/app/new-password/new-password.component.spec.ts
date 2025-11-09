import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPasswordComponent } from './new-password.component';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('NewPasswordComponent', () => {
  let component: NewPasswordComponent;
  let fixture: ComponentFixture<NewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPasswordComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            resetPassword: () => Promise.resolve() // stub Methode
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: {} },  // falls dein Component snapshot nutzt
            queryParams: of({ token: 'mock-token' }) // falls dein Component subscribe() auf queryParams nutzt
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
