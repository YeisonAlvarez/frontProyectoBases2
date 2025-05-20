import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import {RouterOutlet} from '@angular/router';
@Component({
  selector: 'app-gestionar-preguntas',
  standalone: true,
  imports: [CommonModule, MenuComponent, RouterOutlet],
  templateUrl: './gestionar-preguntas.component.html',
  styleUrls: ['./gestionar-preguntas.component.css']
})
export class GestionarPreguntasComponent {}
