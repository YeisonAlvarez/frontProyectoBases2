import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  usuario: any;

  mostrarSubmenuPreguntas = false;
  constructor(private router: Router) {}

  ngOnInit() {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;
    console.log('Usuario cargado:', this.usuario);  // Esto te ayudará a ver si el usuario se carga correctamente
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }


  toggleSubmenu(event: Event) {
    event.preventDefault(); // Evita que el enlace navegue a #
    this.mostrarSubmenuPreguntas = !this.mostrarSubmenuPreguntas;
  }
}
