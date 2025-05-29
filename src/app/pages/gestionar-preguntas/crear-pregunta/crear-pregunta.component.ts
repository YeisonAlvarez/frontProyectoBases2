import { Component } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
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
    idTema: null
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

  temas: any[] = [];

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

    this.cargarTemas();
  }

  async crearPreguntaYOpciones() {
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

    try {
      // Crear pregunta principal
      const idPregunta = await this.http.post<number>(`http://localhost:8080/api/preguntas`, cuerpoPregunta).toPromise() as number;

      this.idPreguntaCreada = idPregunta;

      this.mostrarMensaje('Pregunta creada. Agregando opciones.', 'exito');

      // Guardar opciones principales
      const opcionesValidas = this.opciones.filter(op => op.texto.trim() !== '');
      await Promise.all(opcionesValidas.map(op => {
        const opcionAEnviar = {
          texto: op.texto,
          esCorrecta: op.esCorrecta ? 'S' : 'N',
          idPregunta: idPregunta,
          idSubPregunta: null
        };
        return this.http.post(`http://localhost:8080/api/opciones`, opcionAEnviar).toPromise();
      }));

      // Si tiene subpreguntas, guardar cada una con sus opciones
      if (this.tieneSubpreguntas) {
        for (const sp of this.subpreguntasCreadas) {
          // Crear subpregunta asociada a pregunta principal
          const bodySubpregunta = {
            texto: sp.texto,
            porcentaje: sp.porcentaje,
            tipo: sp.tipo,
            idPreguntaPadre: idPregunta
          };

          const idSubpregunta: number = await this.http.post<number>(`http://localhost:8080/api/subpreguntas`, bodySubpregunta).toPromise() as number;

          // Guardar opciones de la subpregunta
          const opcionesSubValidas = sp.opciones.filter((op: any) => op.texto.trim() !== '');
          await Promise.all(opcionesSubValidas.map((op: any) => {
            const opcionSubAEnviar = {
              texto: op.texto,
              esCorrecta: op.esCorrecta ? 'S' : 'N',
              idPregunta: idPregunta,
              idSubPregunta: idSubpregunta
            };
            return this.http.post(`http://localhost:8080/api/opciones`, opcionSubAEnviar).toPromise();
          }));
        }
      }

      // Limpiar formulario luego de éxito
      this.mostrarMensaje('Pregunta, opciones y subpreguntas registradas correctamente.', 'exito');
      this.pregunta.texto = '';
      this.opciones = [
        { texto: '', esCorrecta: false },
        { texto: '', esCorrecta: false },
        { texto: '', esCorrecta: false },
        { texto: '', esCorrecta: false }
      ];
      this.subpreguntasCreadas = [];
      this.tieneSubpreguntas = false;

    } catch (error) {
      console.error('Error al crear pregunta/opciones/subpreguntas:', error);
      this.mostrarMensaje('Ocurrió un error al guardar la pregunta y sus datos.', 'error');
    }
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

  actualizarSeleccionUnica(indiceSeleccionado: number): void {
    if (this.pregunta.tipo === 'SELECCION_UNICA') {
      this.opciones.forEach((opcion, index) => {
        opcion.esCorrecta = index === indiceSeleccionado;
      });
    }
  }

  cargarTemas() {
    this.http.get<any[]>('http://localhost:8080/api/temas')
      .subscribe({
        next: (data) => this.temas = data,
        error: (err) => this.mostrarMensaje('Error al cargar los temas.', 'error')
      });
  }

  actualizarSeleccionUnicaSub(indexSubpregunta: number, indexOpcionSeleccionada: number): void {
    const subpregunta = this.subpreguntasCreadas[indexSubpregunta];

    if (subpregunta.tipo === 'SELECCION_UNICA') {
      subpregunta.opciones.forEach((opcion: { esCorrecta: boolean }, index: number) => {
        opcion.esCorrecta = index === indexOpcionSeleccionada;
      });

    }
  }

}
