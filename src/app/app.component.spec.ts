import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  // Configuración del módulo de pruebas antes de cada test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // Componentes standalone se importan aquí
    }).compileComponents();
  });

  // Test 1: Verifica que el componente se cree correctamente
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy(); // El componente debe existir
  });

  // Test 2: Verifica que el título del componente sea el esperado
  it(`should have the 'sistema-examenes-frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('sistema-examenes-frontend');
  });

  // Test 3: Verifica que el título se renderice en la plantilla HTML
  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges(); // Actualiza la vista
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent)
      .toContain('Hello, sistema-examenes-frontend');
  });

});
