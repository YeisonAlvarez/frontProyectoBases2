import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-listar-examenes',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],
  templateUrl: './listar-examenes.component.html'
})
export class ListarExamenesComponent {
  usuario: any;
  examenes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const u = localStorage.getItem('usuario');
    this.usuario = u ? JSON.parse(u) : null;

    if (this.usuario) {
      this.http.get<any[]>(`http://localhost:8080/api/examenes/disponibles/${this.usuario.id}`)
        .subscribe(data => this.examenes = data);
    }
  }
}
