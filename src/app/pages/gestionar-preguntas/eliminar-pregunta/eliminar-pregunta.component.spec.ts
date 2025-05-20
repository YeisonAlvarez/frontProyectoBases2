import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarPreguntaComponent } from './eliminar-pregunta.component';

describe('EliminarPreguntaComponent', () => {
  let component: EliminarPreguntaComponent;
  let fixture: ComponentFixture<EliminarPreguntaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarPreguntaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarPreguntaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
