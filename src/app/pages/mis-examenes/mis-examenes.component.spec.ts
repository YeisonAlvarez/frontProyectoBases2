import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisExamenesComponent } from './mis-examenes.component';

describe('MisExamenesComponent', () => {
  let component: MisExamenesComponent;
  let fixture: ComponentFixture<MisExamenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisExamenesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisExamenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
