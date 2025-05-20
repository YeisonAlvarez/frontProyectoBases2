import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-presentar-examen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './presentar-examen.component.html'
})
export class PresentarExamenComponent {
  usuario: any;
  examen: any;
  preguntas: any[] = [];
  respuestas: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const userData = localStorage.getItem('usuario');
    this.usuario = userData ? JSON.parse(userData) : null;

    const idExamen = this.route.snapshot.paramMap.get('id');
    if (idExamen) {
      this.http.get(`http://localhost:8080/api/examenes/${idExamen}/preguntas`)
        .subscribe((data: any) => {
          this.examen = data.examen;
          this.preguntas = data.preguntas;
        });
    }
  }

  seleccionar(idPregunta: number, valor: string) {
    const index = this.respuestas.findIndex(r => r.idPregunta === idPregunta);
    if (index !== -1) {
      this.respuestas[index].valor = valor;
    } else {
      this.respuestas.push({ idPregunta, valor });
    }
  }

  enviar() {
    const body = {
      idEstudiante: this.usuario.id,
      idExamen: this.examen.id,
      respuestas: this.respuestas
    };

    this.http.post('http://localhost:8080/api/examenes/presentar', body)
      .subscribe((resultado: any) => {
        alert(`Tu nota es: ${resultado.notaTotal}`);
        window.location.href = '/estudiante';
      });
  }
}
