import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth/auth.component';
import { AuthGuard } from './auth/auth/auth.guard';
import { TeamComponent } from './team/team.component';

const routes: Routes = [
  {path:'', redirectTo:'/players', pathMatch:"full"},
  {path:'team', component:TeamComponent, canActivate: [AuthGuard]},
  {path:'auth', component:AuthComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
