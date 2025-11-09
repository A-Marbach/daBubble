import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataProtectionComponent } from './data-protection.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DataProtectionComponent', () => {
  let component: DataProtectionComponent;
  let fixture: ComponentFixture<DataProtectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataProtectionComponent], // standalone
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },       // falls snapshot genutzt wird
            paramMap: of({ get: (key: string) => 'dummy' }) // falls paramMap genutzt wird
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});