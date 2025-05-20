import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-mis-examenes',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],
  templateUrl: './mis-examenes.component.html'
})
export class MisExamenesComponent {
  usuario: any;
  examenes: any[] = [];
  estadisticas: any = null;
  idSeleccionado: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const u = localStorage.getItem('usuario');
    this.usuario = u ? JSON.parse(u) : null;

    if (this.usuario) {
      this.http.get<any[]>(`http://localhost:8080/api/examenes/profesor/${this.usuario.id}`)
        .subscribe(data => this.examenes = data);
    }
  }

  verEstadisticas(idExamen: number) {
    this.idSeleccionado = idExamen;
    this.http.get<any>(`http://localhost:8080/api/estadisticas/examen/${idExamen}`)
      .subscribe(data => this.estadisticas = data);
  }
}
