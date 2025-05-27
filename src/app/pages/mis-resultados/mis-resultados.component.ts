import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface ResultadoExamen {
  nombreExamen: string;
  respuestasCorrectas: number;
  respuestasIncorrectas: number;
  calificacion: number;
}

@Component({
  selector: 'app-mis-resultados',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './mis-resultados.component.html',
  styleUrls: ['./mis-resultados.component.css']
})
export class MisResultadosComponent {
  resultados: ResultadoExamen[] = [];
  usuario: any;
  errorCargando = false;

  private readonly API_URL = 'http://localhost:8080/api/examenes';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;

    if (this.usuario?.id) {
      this.http.get<ResultadoExamen[]>(`${this.API_URL}/resultados?idEstudiante=${this.usuario.id}`)
        .subscribe({
          next: (data) => {
            this.resultados = data;
            this.errorCargando = false;
          },
          error: () => {
            this.errorCargando = true;
          }
        });
    }
  }
}
