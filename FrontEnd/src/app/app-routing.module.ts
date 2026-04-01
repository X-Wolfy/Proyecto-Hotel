import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HuespedesComponent } from './components/huespedes/huespedes.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

const routes: Routes = [
  {path : 'dashboard', component: DashboardComponent, children:[  
    {path: 'huespedes', component: HuespedesComponent},
    {path: 'habitaciones', component: HabitacionesComponent},
    {path: 'reservas', component: ReservasComponent},
    {path: 'usuarios', component: UsuariosComponent}
  ]},
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
