import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-estudiantes-grupo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-estudiantes-grupo.component.html',
  styleUrls: ['./admin-estudiantes-grupo.component.css']
})
export class AdminEstudiantesGrupoComponent implements OnInit {
  grupos: any[] = [];
  estudiantes: any[] = [];
  grupoSeleccionado: any = null;
  estudianteSeleccionado: any = null;
  nuevoEstudianteId: string = '';
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | 'info' = 'info';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarGrupos();
  }

  cargarGrupos() {
    this.http.get<any[]>('http://localhost:8080/api/grupos').subscribe({
      next: data => this.grupos = data,
      error: () => this.mostrarMensaje('Error cargando grupos', 'error')
    });
  }

  seleccionarGrupo(grupo: any) {
    this.grupoSeleccionado = grupo;
    this.cargarEstudiantesGrupo(grupo.id);
  }

  cargarEstudiantesGrupo(idGrupo: number) {
    this.http.get<any[]>(`http://localhost:8080/api/inscripciones/grupo/${idGrupo}/estudiantes`).subscribe({
      next: data => this.estudiantes = data,
      error: () => this.mostrarMensaje('Error cargando estudiantes del grupo', 'error')
    });
  }

  asignarEstudiante() {
    if (!this.nuevoEstudianteId || !this.grupoSeleccionado) return;
    const body = { idGrupo: this.grupoSeleccionado.id, idEstudiante: this.nuevoEstudianteId };
    this.http.post('http://localhost:8080/api/inscripciones', body).subscribe({
      next: () => {
        this.mostrarMensaje('Estudiante asignado correctamente', 'exito');
        this.nuevoEstudianteId = '';
        this.cargarEstudiantesGrupo(this.grupoSeleccionado.id);
      },
      error: () => this.mostrarMensaje('Error asignando estudiante', 'error')
    });
  }

  eliminarEstudiante(idEstudiante: number) {
    if (!this.grupoSeleccionado) return;
    this.http.delete(`http://localhost:8080/api/inscripciones/${this.grupoSeleccionado.id}/${idEstudiante}`).subscribe({
      next: () => {
        this.mostrarMensaje('Estudiante eliminado del grupo', 'exito');
        this.cargarEstudiantesGrupo(this.grupoSeleccionado.id);
      },
      error: () => this.mostrarMensaje('Error eliminando estudiante', 'error')
    });
  }

  mostrarMensaje(msg: string, tipo: 'exito' | 'error' | 'info') {
    this.mensaje = msg;
    this.tipoMensaje = tipo;
    setTimeout(() => this.mensaje = '', 3000);
  }
}
