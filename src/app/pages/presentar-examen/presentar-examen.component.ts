import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

interface Opcion {
  id: number;
  texto: string;
  es_correcta?: string;
}

interface Subpregunta {
  id: number;
  texto: string;
  opciones: Opcion[];
}

interface Pregunta {
  id: number;
  texto: string;
  opciones: Opcion[];
  subpreguntas?: Subpregunta[];
}

interface Examen {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Respuesta {
  idPregunta: number;
  respuestaTexto: string;
}

interface ExamenConEstado {
  id: number;
  nombre: string;
  descripcion: string;
  presentado: boolean;
}



@Component({
  selector: 'app-presentar-examen',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, NgFor, HttpClientModule],
  templateUrl: './presentar-examen.component.html',
  styleUrls: ['./presentar-examen.component.css'],
})
export class PresentarExamenComponent {
  usuario: any;
  examenes: Examen[] = []; // Exámenes normales (sin estado)
  examenesConEstado: ExamenConEstado[] = []; // Exámenes con estado "presentado"
  examen?: Examen;
  preguntas: Pregunta[] = [];
  respuestas: Respuesta[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const userData = localStorage.getItem('usuario');
    this.usuario = userData ? JSON.parse(userData) : null;

    if (this.usuario) {
      // Obtener exámenes con estado
      this.http.get<ExamenConEstado[]>(
        `http://localhost:8080/api/examenes/disponibles-con-estado/${this.usuario.id}`
      ).subscribe((estadoData) => {
        this.examenesConEstado = estadoData;
      });

      // Obtener exámenes disponibles
      this.http.get<Examen[]>(
        `http://localhost:8080/api/examenes/disponibles/${this.usuario.id}`
      ).subscribe((examenesDisponibles) => {
        this.examenes = examenesDisponibles;
      });
    }

    const idExamen = this.route.snapshot.paramMap.get('id');
    if (idExamen) {
      this.cargarExamenConPreguntas(+idExamen);
    }
  }

  presentar(examen: Examen) {
    this.examen = examen;
    this.preguntas = [];
    this.respuestas = [];
    this.cargarExamenConPreguntas(examen.id);
  }

  cargarExamenConPreguntas(idExamen: number) {
    this.http
      .get<{ examen: Examen; preguntas: Pregunta[] }>(
        `http://localhost:8080/api/examenes/preguntas/${idExamen}`
      )
      .subscribe((data) => {
        this.examen = data.examen;
        this.preguntas = data.preguntas;
      });
  }

  seleccionar(idPregunta: number, idOpcion: number) {
    const pregunta = this.preguntas.find((p) => p.id === idPregunta);
    if (!pregunta) return;

    const opcion = pregunta.opciones.find((op: Opcion) => op.id === idOpcion);
    if (!opcion) return;

    const index = this.respuestas.findIndex((r) => r.idPregunta === idPregunta);
    if (index !== -1) {
      this.respuestas[index] = { idPregunta, respuestaTexto: opcion.texto };
    } else {
      this.respuestas.push({ idPregunta, respuestaTexto: opcion.texto });
    }
  }

  enviar() {
    if (!this.usuario || !this.examen) return;

    const idExamenActual = this.examen.id;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez enviado, no podrás cambiar tus respuestas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar examen',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          idEstudiante: this.usuario.id,
          idExamen: idExamenActual,
          respuestas: this.respuestas,
        };

        this.http.post<{ notaTotal: number }>('http://localhost:8080/api/examenes/presentar', body).subscribe({
          next: (resultado) => {
            this.mostrarMensaje(`¡Examen enviado con éxito! Tu nota es: ${resultado.notaTotal}`, 'exito');
            setTimeout(() => {
              window.location.href = '/estudiante';
            }, 2500);
          },
          error: (error) => {
            console.error('Error al enviar el examen:', error);
            this.mostrarMensaje('Ocurrió un error al enviar el examen. Por favor intenta nuevamente.', 'error');
          }
        });
      }
    });
  }


  mostrarMensaje(mensaje: string, tipo: 'exito' | 'error' = 'exito') {
    Swal.fire({
      icon: tipo === 'error' ? 'error' : 'success',
      title: tipo === 'error' ? 'Error' : 'Éxito',
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });
  }

  examenFuePresentado(idExamen: number): boolean {
    return this.examenesConEstado.some(e => e.id === idExamen && e.presentado);
  }



}
