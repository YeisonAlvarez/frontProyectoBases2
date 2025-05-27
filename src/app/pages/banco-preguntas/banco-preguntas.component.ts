import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Observable } from "rxjs";

@Component({
  selector: 'app-banco-preguntas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './banco-preguntas.component.html',
  styleUrls: ['./banco-preguntas.component.css'],
})
export class BancoPreguntasComponent {
  temas: any[] = [];
  preguntas: any[] = [];
  idTema: number | null = null;
  usuario: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;
    this.cargarTemas();
  }

  cargarTemas() {
    this.http.get<any[]>('http://localhost:8080/api/temas').subscribe({
      next: (data) => (this.temas = data),
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los temas.', 'error');
      },
    });
  }

  cargarPreguntas() {
    if (!this.idTema || !this.usuario) {
      this.preguntas = [];
      return;
    }

    const url = `http://localhost:8080/api/preguntas/banco?idTema=${this.idTema}&idProfesor=${this.usuario.id}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.preguntas = data;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las preguntas del banco.', 'error');
      },
    });
  }

  esPropia(pregunta: any): boolean {
    return pregunta.idProfesor === this.usuario?.id;
  }

  editar(pregunta: any): void {
    console.log('Editar pregunta', pregunta);
    // Aquí lógica para editar o navegar a otro componente
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete<void>(`http://localhost:8080/api/preguntas/${id}`).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La pregunta fue eliminada.', 'success');
            this.cargarPreguntas();  // Recarga la lista después de eliminar
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la pregunta.', 'error');
          }
        });
      }
    });
  }
}
