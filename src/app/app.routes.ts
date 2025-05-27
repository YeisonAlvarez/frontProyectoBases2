import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardProfesorComponent } from './pages/dashboard-profesor/dashboard-profesor.component';
import { DashboardEstudianteComponent } from './pages/dashboard-estudiante/dashboard-estudiante.component';
import { ListarExamenesComponent } from './pages/listar-examenes/listar-examenes.component';
import { PresentarExamenComponent } from './pages/presentar-examen/presentar-examen.component';
import { CrearExamenComponent } from './pages/crear-examen/crear-examen.component';
import { GestionarPreguntasComponent } from './pages/gestionar-preguntas/gestionar-preguntas.component';
import { MisExamenesComponent } from './pages/mis-examenes/mis-examenes.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { CrearPreguntaComponent } from './pages/gestionar-preguntas/crear-pregunta/crear-pregunta.component';
import { EliminarPreguntaComponent } from './pages/gestionar-preguntas/eliminar-pregunta/eliminar-pregunta.component';
import { BancoPreguntasComponent } from './pages/banco-preguntas/banco-preguntas.component';
import { MisResultadosComponent } from './pages/mis-resultados/mis-resultados.component';



export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'profesor', component: DashboardProfesorComponent },
  { path: 'estudiante', component: DashboardEstudianteComponent },
  { path: 'estudiante/examenes', component: ListarExamenesComponent },
  { path: 'estudiante/presentar-examen', component: PresentarExamenComponent },
  { path: 'profesor/crear-examen', component: CrearExamenComponent },
  { path: 'profesor/mis-examenes', component: MisExamenesComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'profesor/banco-preguntas', component: BancoPreguntasComponent },
  {
    path: 'profesor/gestionar-preguntas',
    component: GestionarPreguntasComponent,
    children: [
      { path: 'crear-pregunta', component: CrearPreguntaComponent },
      { path: 'eliminar-pregunta', component: EliminarPreguntaComponent }
    ]
  },
  { path: 'estudiante/mis-resultados', component: MisResultadosComponent }

];
