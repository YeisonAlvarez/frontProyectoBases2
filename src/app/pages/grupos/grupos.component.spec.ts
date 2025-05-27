import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GruposComponent } from './grupos.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('GruposComponent', () => {
  let component: GruposComponent;
  let fixture: ComponentFixture<GruposComponent>;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GruposComponent, HttpClientTestingModule, FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruposComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar grupos correctamente', () => {
    const gruposMock = [
      { id: 1, idCurso: 10, nombre: 'Grupo A' },
      { id: 2, idCurso: 20, nombre: 'Grupo B' }
    ];
    const req = httpMock.expectOne('http://localhost:8080/api/grupos');
    expect(req.request.method).toBe('GET');
    req.flush(gruposMock);
    expect(component.grupos.length).toBe(2);
    expect(component.grupos[0].nombre).toBe('Grupo A');
  });

  it('debe mostrar mensaje de error al fallar la carga', () => {
    const req = httpMock.expectOne('http://localhost:8080/api/grupos');
    req.error(new ErrorEvent('Error'));
    expect(component.mensaje).toContain('Error al cargar grupos');
    expect(component.tipoMensaje).toBe('error');
  });

  it('debe validar antes de crear grupo', () => {
    component.nuevoGrupo = { nombre: '', idCurso: undefined };
    component.crearGrupo();
    expect(component.mensaje).toContain('Por favor, complete todos los campos');
    expect(component.tipoMensaje).toBe('error');
  });

  it('debe validar antes de actualizar grupo', () => {
    component.grupoSeleccionado = { id: 1, nombre: '', idCurso: undefined } as any;
    component.actualizarGrupo();
    expect(component.mensaje).toContain('Por favor, complete todos los campos');
    expect(component.tipoMensaje).toBe('error');
  });

  // Puedes agregar más tests para eliminar, editar, etc.
});
