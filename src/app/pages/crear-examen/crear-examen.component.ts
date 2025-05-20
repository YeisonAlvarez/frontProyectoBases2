import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-crear-examen',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  // Agregar HttpClientModule aquí
  templateUrl: './crear-examen.component.html',
  styleUrls: ['./crear-examen.component.css']
})
export class CrearExamenComponent {
  examen = {
    nombre: '',
    descripcion: '',
    categoria: '',
    totalPreguntasBanco: 10,
    totalPreguntasExamen: 5,
    duracionMinutos: 30,
    fechaInicio: '',
    fechaFin: '',
    idGrupo: 1
  };

  usuario: any;
  mensaje = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('Componente CrearExamen cargado');
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;

    if (!this.usuario || this.usuario.rol !== 'PROFESOR') {
      this.mensaje = 'Acceso no autorizado. Debes ser profesor para crear un examen.';
      console.error('Acceso no autorizado. El usuario no tiene el rol adecuado.');
      return;
    }
    console.log('Usuario autenticado:', this.usuario);  // Verifica si el usuario es el adecuado
  }

  crear() {
    if (!this.usuario) {
      this.mensaje = 'Usuario no encontrado en localStorage.';
      console.error('Usuario no encontrado.');
      return;
    }

    // Prepara el cuerpo de la solicitud
    const body = {
      ...this.examen,
      idProfesor: this.usuario.id
    };

    this.http.post('http://localhost:8080/api/quizzes', body)
      .subscribe({
        next: (res: any) => {
          // Aquí puedes verificar si res es un string o un objeto, y manejarlo
          console.log('Respuesta del servidor:', res);
          if (typeof res === 'string') {
            this.mensaje = res;  // Asumir que la respuesta es un mensaje
          } else {
            this.mensaje = 'Examen creado correctamente.';
          }
        },
        error: (err) => {
          this.mensaje = 'Error al crear el examen';
          console.error('Error al crear examen:', err);
        }
      });
  }


}
