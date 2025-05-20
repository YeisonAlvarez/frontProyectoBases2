import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {MenuComponent} from '../../../components/menu/menu.component';

@Component({
  selector: 'app-eliminar-pregunta',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MenuComponent],
  templateUrl: './eliminar-pregunta.component.html',
  styleUrls: ['./eliminar-pregunta.component.css']
})
export class EliminarPreguntaComponent {
  idPreguntaEliminar = '';
  mensaje = '';

  constructor(private http: HttpClient) {}

  eliminarPregunta() {
    if (!this.idPreguntaEliminar) return;

    this.http.delete(`http://localhost:8080/api/preguntas/${this.idPreguntaEliminar}`).subscribe({
      next: () => {
        this.mensaje = `Pregunta con ID ${this.idPreguntaEliminar} eliminada correctamente.`;
        this.idPreguntaEliminar = '';
      },
      error: () => {
        this.mensaje = `Error al eliminar la pregunta con ID ${this.idPreguntaEliminar}.`;
      }
    });
  }
}
