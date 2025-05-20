import { Component } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {MenuComponent} from '../../../components/menu/menu.component';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-pregunta',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './crear-pregunta.component.html',
  styleUrl: './crear-pregunta.component.css'
})
export class CrearPreguntaComponent {
  usuario: any;

  pregunta = {
    texto: '',
    tipo: 'SELECCION_UNICA',
    porcentaje: 100,
    dificultad: 'FACIL',
    tiempoLimite: 60,
    esPublica: 'S',
    idTema: 1
  };

  opciones = [
    { texto: '', esCorrecta: false },
    { texto: '', esCorrecta: false },
    { texto: '', esCorrecta: false },
    { texto: '', esCorrecta: false }
  ];

  subpregunta = {
    texto: '',
    porcentaje: 0
  };

  subpreguntasCreadas: any[] = [];  // Para mostrar las subpreguntas agregadas
  tieneSubpreguntas: boolean = false;

  idPreguntaCreada = 0;
  mensaje = '';
  idPreguntaEliminar = '';

  tipoMensaje: 'exito' | 'error' | '' = '';

  mostrarMensaje(mensaje: string, tipo: 'exito' | 'error' = 'exito') {
    Swal.fire({
      icon: tipo === 'error' ? 'error' : 'success',
      title: tipo === 'error' ? 'Error' : 'Éxito',
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });
  }


  constructor(private http: HttpClient) {}

  ngOnInit() {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;

    if (!this.usuario || this.usuario.rol !== 'PROFESOR') {
      this.mostrarMensaje('Acceso denegado. Solo los profesores pueden gestionar preguntas.', 'error');
    }
  }

  crearPreguntaYOpciones() {
    if (!this.usuario) return;

    const cuerpoPregunta = {
      texto: this.pregunta.texto,
      tipo: this.pregunta.tipo,
      porcentaje: this.pregunta.porcentaje,
      dificultad: this.pregunta.dificultad,
      tiempoLimite: this.pregunta.tiempoLimite,
      esPublica: this.pregunta.esPublica,
      idTema: this.pregunta.idTema,
      idProfesor: this.usuario.id
    };

    this.http.post<number>(`http://localhost:8080/api/preguntas`, cuerpoPregunta).subscribe({
      next: (idPregunta: number) => {
        this.idPreguntaCreada = idPregunta;
        this.mostrarMensaje('Pregunta creada. Agregando opciones.', 'exito');

        const opcionesValidas = this.opciones.filter(op => op.texto.trim() !== '');
        const peticiones = opcionesValidas.map(op => {
          const opcionAEnviar = {
            texto: op.texto,
            esCorrecta: op.esCorrecta ? 'S' : 'N',
            idPregunta: idPregunta
          };
          console.log("valor:",  idPregunta.valueOf());
          console.log("Enviando opción:", opcionAEnviar);
          return this.http.post(`http://localhost:8080/api/opciones`, opcionAEnviar).toPromise();
        });

        Promise.all(peticiones)
          .then(() => {
            this.mostrarMensaje('Pregunta y opciones registradas correctamente.', 'exito');
            this.pregunta.texto = '';
            this.opciones = [
              { texto: '', esCorrecta: false },
              { texto: '', esCorrecta: false },
              { texto: '', esCorrecta: false },
              { texto: '', esCorrecta: false }
            ];
          })
          .catch(error => {
            console.error('Error registrando opciones:', error);
            this.mostrarMensaje('Ocurrió un error al guardar las opciones.', 'error');
          });

      },
      error: (err) => {
        console.error('Error al crear la pregunta:', err);
        this.mostrarMensaje('Error al crear la pregunta. Intenta de nuevo.', 'error');
      }

    });

  }

  crearSubpregunta() {
    if (!this.idPreguntaCreada) {
      this.mostrarMensaje('Primero debes crear una pregunta principal.', 'error');
      return;
    }

    const body = {
      texto: this.subpregunta.texto,
      porcentaje: this.subpregunta.porcentaje,
      idPreguntaPadre: this.idPreguntaCreada
    };

    this.http.post('http://localhost:8080/api/subpreguntas', body).subscribe({
      next: (id: any) => {
        this.subpreguntasCreadas.push({
          id,
          texto: this.subpregunta.texto,
          porcentaje: this.subpregunta.porcentaje
        });
        this.subpregunta.texto = '';
        this.subpregunta.porcentaje = 0;
        this.mostrarMensaje('Subpregunta agregada correctamente.', 'exito');
      },
      error: (err) => {
        this.mostrarMensaje(err.error || 'Error al agregar la subpregunta.', 'error');
      }
    });
  }

  agregarSubpregunta() {
    this.subpreguntasCreadas.push({
      texto: '',
      porcentaje: 0,
      opciones: [{ texto: '', esCorrecta: false }]
    });
  }

  agregarOpcionASubpregunta(index: number) {
    this.subpreguntasCreadas[index].opciones.push({ texto: '', esCorrecta: false });
  }
  get porcentajeTotalSubpreguntas(): number {
    return this.subpreguntasCreadas.reduce((total, sp) => total + Number(sp.porcentaje), 0);
  }
}
