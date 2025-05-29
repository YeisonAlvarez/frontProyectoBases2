import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-examen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgClass
  ],
  templateUrl: './crear-examen.component.html',
  styleUrls: ['./crear-examen.component.css'],
})
export class CrearExamenComponent {
  examen = {
    nombre: '',
    descripcion: '',
    totalPreguntasBanco: 10,
    totalPreguntasExamen: 5,
    duracionMinutos: 30,
    fechaInicio: '',
    fechaFin: '',
    idTema: 0,
    idProfesor: 0,
  };

  usuario: any = null;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' = 'exito';
  grupos: any[] = [];
  gruposSeleccionados: number[] = [];

  temas: any[] = [];
  preguntasBanco: any[] = [];
  preguntasSeleccionadas: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;

    if (!this.usuario || this.usuario.rol !== 'PROFESOR') {
      this.mostrarMensaje('Acceso no autorizado. Debes ser profesor para crear un examen.', 'error');

      return;
    }

    this.examen.idProfesor = this.usuario.id;
    this.cargarTemas();
    this.cargarGrupos();
  }

  mostrarMensaje(mensaje: string, tipo: 'exito' | 'error' = 'exito') {
    Swal.fire({
      icon: tipo === 'error' ? 'error' : 'success',
      title: tipo === 'error' ? 'Error' : 'Éxito',
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });
  }

  cargarTemas() {
    this.http.get<any[]>('http://localhost:8080/api/temas').subscribe({
      next: (data) => (this.temas = data),
      error: () => {
        this.mostrarMensaje('Error cargando temas.', 'error');

      },
    });
  }

  cargarPreguntasBanco() {
    if (!this.examen.idTema || this.examen.totalPreguntasBanco < 1) {
      this.preguntasBanco = [];
      this.preguntasSeleccionadas = [];
      return;
    }

    this.http
      .get<any[]>(`http://localhost:8080/api/preguntas/tema/${this.examen.idTema}?limite=${this.examen.totalPreguntasBanco}`)
      .subscribe({
        next: (data) => {
          this.preguntasBanco = data;
          this.preguntasSeleccionadas = [];
        },
        error: () => {
          this.mostrarMensaje('Error cargando preguntas del banco.', 'error');

        },
      });
  }

  togglePreguntaSeleccionada(idPregunta: number, seleccionado: boolean) {
    if (seleccionado) {
      if (this.preguntasSeleccionadas.length < this.examen.totalPreguntasExamen) {
        this.preguntasSeleccionadas.push(idPregunta);
      }
    } else {
      this.preguntasSeleccionadas = this.preguntasSeleccionadas.filter((id) => id !== idPregunta);
    }
  }

  crear() {
    if (this.preguntasSeleccionadas.length !== this.examen.totalPreguntasExamen) {
      this.mostrarMensaje(`Debes seleccionar exactamente ${this.examen.totalPreguntasExamen} preguntas.`, 'error');
      return;
    }

    const examenPayload = {
      nombre: this.examen.nombre,
      descripcion: this.examen.descripcion,
      totalPreguntasBanco: this.examen.totalPreguntasBanco,
      totalPreguntasExamen: this.examen.totalPreguntasExamen,
      duracionMinutos: this.examen.duracionMinutos,
      fechaInicio: this.examen.fechaInicio,
      fechaFin: this.examen.fechaFin,
      idProfesor: this.examen.idProfesor,
      idTema: this.examen.idTema,
    };

    // Crear el examen
    this.http.post<number>('http://localhost:8080/api/examenes', examenPayload).subscribe({
      next: (idExamen) => {
        // Asignar preguntas seleccionadas
        const asignaciones = this.preguntasSeleccionadas.map((idPregunta) => {
          const epPayload = {
            idExamen,
            idPregunta,
            porcentaje: 100 / this.preguntasSeleccionadas.length,
          };
          return this.http.post('http://localhost:8080/api/examenes/preguntas', epPayload, { responseType: 'text' }).toPromise();
        });

        // Esperar todas las asignaciones
        Promise.all(asignaciones)
          .then(() => {
            // Asignar el examen a los grupos seleccionados
            const asignacionesGrupos = this.gruposSeleccionados.map(idGrupo => {
              const egPayload = { idExamen, idGrupo };
              return this.http.post('http://localhost:8080/api/examenes/grupos', egPayload, { responseType: 'text' }).toPromise();
            });

            return Promise.all(asignacionesGrupos);
          })
          .then(() => {
            this.mostrarMensaje('Examen creado, preguntas y grupos asignados correctamente.', 'exito');
            this.reiniciarFormulario();
          })
          .catch((error) => {
            console.error('Error en asignaciones:', error);
            this.mostrarMensaje('Examen creado, pero ocurrió un error al asignar preguntas o grupos.', 'error');
          });
      },
      error: (err) => {
        console.error('Error creando examen:', err);
        this.mostrarMensaje('Error al crear el examen.', 'error');
      },
    });
  }


  reiniciarFormulario() {
    this.examen = {
      nombre: '',
      descripcion: '',
      totalPreguntasBanco: 10,
      totalPreguntasExamen: 5,
      duracionMinutos: 30,
      fechaInicio: '',
      fechaFin: '',
      idTema: 0,
      idProfesor: this.usuario.id,
    };
    this.preguntasBanco = [];
    this.preguntasSeleccionadas = [];
  }

  cargarGrupos() {
    this.http.get<any[]>(`http://localhost:8080/api/grupos`).subscribe({
      next: (data) => this.grupos = data,
      error: () => this.mostrarMensaje('Error cargando grupos.', 'error')
    });
  }

  toggleGrupoSeleccionado(idGrupo: number, seleccionado: boolean) {
    if (seleccionado) {
      this.gruposSeleccionados.push(idGrupo);
    } else {
      this.gruposSeleccionados = this.gruposSeleccionados.filter(id => id !== idGrupo);
    }
  }
}
