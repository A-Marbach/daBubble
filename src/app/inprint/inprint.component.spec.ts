import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InprintComponent } from './inprint.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('InprintComponent', () => {
  let component: InprintComponent;
  let fixture: ComponentFixture<InprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InprintComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // Mock für params Observable
            snapshot: { paramMap: { get: () => null } } // falls snapshot genutzt wird
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
