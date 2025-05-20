import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Importar correctamente HttpClient y HttpErrorResponse
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';  // Importar correctamente HttpClientModule

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule], // Asegúrate de agregar HttpClientModule aquí
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  nombre = '';
  correo = '';
  contrasena = '';
  rol = 'ESTUDIANTE';
  error = '';
  mensaje = '';

  constructor(private http: HttpClient, private router: Router) {}

  registrar() {
    const body = {
      nombre: this.nombre,
      correo: this.correo,
      contrasena: this.contrasena,
      rol: this.rol
    };

    this.http.post('http://localhost:8080/api/usuarios', body).subscribe({
      next: () => {
        this.mensaje = 'Usuario registrado correctamente. Redirigiendo al login…';
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err: HttpErrorResponse) => {
        // Verificar si err.error es un objeto o un mensaje
        if (err.error instanceof Object) {
          this.error = JSON.stringify(err.error);  // Convertir objeto a cadena si es necesario
        } else {
          this.error = err.error || 'Error al registrar usuario';
        }
      }
    });
  }
}
