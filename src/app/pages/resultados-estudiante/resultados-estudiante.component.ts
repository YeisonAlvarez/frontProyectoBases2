import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-resultados-estudiante',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],
  templateUrl: './resultados-estudiante.component.html',
  styleUrls: ['./resultados-estudiante.component.css'],
})
export class ResultadosEstudianteComponent {
  usuario: any;
  resultados: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const u = localStorage.getItem('usuario');
    this.usuario = u ? JSON.parse(u) : null;

    if (this.usuario) {
      this.http.get<any[]>(`http://localhost:8080/api/resultados/estudiante/${this.usuario.id}`)
        .subscribe(data => this.resultados = data);
    }
  }
}
