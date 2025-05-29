import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface Grupo {
  id: number;
  idCurso: number;
  nombre: string;
}

interface GrupoConCurso extends Grupo {
  nombreCurso?: string;
}

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {
  grupos: GrupoConCurso[] = [];
  grupoSeleccionado: GrupoConCurso | null = null;
  nuevoGrupo: Partial<GrupoConCurso> = {};
  modoEdicion = false;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | 'info' = 'info';
  cursos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Primero cargamos los cursos y luego los grupos
    this.cargarCursos();
    this.cargarGrupos();
  }

  cargarGrupos() {
    this.mensaje = 'Cargando grupos...';
    this.tipoMensaje = 'info';
    this.http.get<Grupo[]>('http://localhost:8080/api/grupos').subscribe({
      next: data => {
        this.grupos = data;
        if (data.length > 0) {
          this.mensaje = '';
        } else {
          this.mensaje = 'No hay grupos disponibles.';
          this.tipoMensaje = 'info';
        }
        console.log('Grupos cargados:', data);

        // Asignar nombres de cursos a los grupos
        this.actualizarNombresCursos();
      },
      error: (err) => {
        console.error('Error al cargar grupos:', err);
        this.mensaje = 'Error al cargar grupos. Por favor, intente de nuevo.';
        this.tipoMensaje = 'error';
      }
    });
  }

  // Método para actualizar los nombres de los cursos en los grupos
  actualizarNombresCursos() {
    if (this.grupos.length > 0 && this.cursos.length > 0) {
      this.grupos.forEach(grupo => {
        const cursoEncontrado = this.cursos.find(curso => curso.id === grupo.idCurso);
        if (cursoEncontrado) {
          grupo.nombreCurso = cursoEncontrado.nombre;
        } else {
          grupo.nombreCurso = 'Curso no encontrado';
        }
      });
    }
  }

  cargarCursos() {
    this.http.get<any[]>('http://localhost:8080/api/cursos').subscribe({
      next: data => {
        this.cursos = data;
        console.log('Cursos cargados:', data);

        // Actualizar los nombres de los cursos en los grupos
        this.actualizarNombresCursos();
      },
      error: (err) => {
        console.error('Error al cargar cursos:', err);
        this.mensaje = 'Error al cargar cursos. Por favor, intente de nuevo.';
        this.tipoMensaje = 'error';
      }
    });
  }

  seleccionarGrupo(grupo: Grupo) {
    this.grupoSeleccionado = { ...grupo };
    this.modoEdicion = true;
    this.mensaje = '';
    this.tipoMensaje = 'info';
  }

  cancelarEdicion() {
    this.grupoSeleccionado = null;
    this.modoEdicion = false;
    this.mensaje = '';
    this.tipoMensaje = 'info';
  }

  crearGrupo() {
    if (!this.nuevoGrupo.nombre || !this.nuevoGrupo.idCurso) {
      this.mensaje = 'Por favor, complete todos los campos.';
      this.tipoMensaje = 'error';
      return;
    }

    this.mensaje = 'Creando grupo...';
    this.tipoMensaje = 'info';
    console.log('Creando grupo:', this.nuevoGrupo);

    this.http.post('http://localhost:8080/api/grupos', this.nuevoGrupo).subscribe({
      next: (response) => {
        console.log('Grupo creado:', response);
        this.mensaje = 'Grupo creado correctamente';
        this.tipoMensaje = 'exito';
        this.nuevoGrupo = {};
        this.cargarGrupos();
      },
      error: (err) => {
        console.error('Error al crear el grupo:', err);
        this.mensaje = 'Error al crear el grupo. Por favor, intente de nuevo.';
        this.tipoMensaje = 'error';
      }
    });
  }

  actualizarGrupo() {
    if (!this.grupoSeleccionado) return;

    if (!this.grupoSeleccionado.nombre || !this.grupoSeleccionado.idCurso) {
      this.mensaje = 'Por favor, complete todos los campos.';
      this.tipoMensaje = 'error';
      return;
    }

    this.mensaje = 'Actualizando grupo...';
    this.tipoMensaje = 'info';
    console.log('Actualizando grupo:', this.grupoSeleccionado);

    this.http.put(`http://localhost:8080/api/grupos/${this.grupoSeleccionado.id}`, this.grupoSeleccionado).subscribe({
      next: (response) => {
        console.log('Grupo actualizado:', response);
        this.mensaje = 'Grupo actualizado correctamente';
        this.tipoMensaje = 'exito';
        this.cancelarEdicion();
        this.cargarGrupos();
      },
      error: (err) => {
        console.error('Error al actualizar el grupo:', err);
        this.mensaje = 'Error al actualizar el grupo. Por favor, intente de nuevo.';
        this.tipoMensaje = 'error';
      }
    });
  }

  eliminarGrupo(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este grupo?')) return;

    this.mensaje = 'Eliminando grupo...';
    this.tipoMensaje = 'info';
    console.log('Eliminando grupo con ID:', id);

    this.http.delete(`http://localhost:8080/api/grupos/${id}`).subscribe({
      next: (response) => {
        console.log('Grupo eliminado:', response);
        this.mensaje = 'Grupo eliminado correctamente';
        this.tipoMensaje = 'exito';
        this.cargarGrupos();
      },
      error: (err) => {
        console.error('Error al eliminar el grupo:', err);
        this.mensaje = 'Error al eliminar el grupo. Por favor, intente de nuevo.';
        this.tipoMensaje = 'error';
      }
    });
  }
}
