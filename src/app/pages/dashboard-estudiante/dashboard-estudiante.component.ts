import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-dashboard-estudiante',
  standalone: true,
  imports: [CommonModule, MenuComponent],  // Aquí se agrega MenuComponent
  templateUrl: './dashboard-estudiante.component.html'
})
export class DashboardEstudianteComponent {
  usuario: any;

  ngOnInit() {
    const u = localStorage.getItem('usuario');
    this.usuario = u ? JSON.parse(u) : null;
  }
}
