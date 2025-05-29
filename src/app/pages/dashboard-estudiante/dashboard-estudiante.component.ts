import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-dashboard-estudiante',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],  // Agregamos RouterModule para los enlaces
  templateUrl: './dashboard-estudiante.component.html',
  styleUrls: ['./dashboard-estudiante.component.css']
})
export class DashboardEstudianteComponent {
  usuario: any;

  ngOnInit() {
    const u = localStorage.getItem('usuario');
    this.usuario = u ? JSON.parse(u) : null;
  }
}
