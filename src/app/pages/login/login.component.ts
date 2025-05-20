import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const body = {
      correo: this.correo,
      contrasena: this.contrasena
    };

    this.http.post('http://localhost:8080/api/usuarios/login', body).subscribe({
      next: (usuario: any) => {
        localStorage.setItem('usuario', JSON.stringify(usuario));

        if (usuario.rol === 'PROFESOR') {
          this.router.navigate(['/profesor']);
        } else if (usuario.rol === 'ESTUDIANTE') {
          this.router.navigate(['/estudiante']);
        }
      },
      error: () => {
        this.error = 'Credenciales inválidas';
      }
    });
  }
}
