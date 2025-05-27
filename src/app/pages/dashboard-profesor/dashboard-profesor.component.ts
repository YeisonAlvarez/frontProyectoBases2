import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import { BancoPreguntasComponent } from '../banco-preguntas/banco-preguntas.component';


@Component({
  selector: 'app-dashboard-profesor',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    BancoPreguntasComponent // 👈 Importación del nuevo componente
  ],
  templateUrl: './dashboard-profesor.component.html'
})
export class DashboardProfesorComponent {
  usuario: any;

  ngOnInit() {
    const u = localStorage.getItem('usuario');
    this.usuario = u ? JSON.parse(u) : null;
  }
}
