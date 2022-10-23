import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth/auth.component';
import { AuthGuard } from './auth/auth/auth.guard';
import { AddPlayerComponent } from './players/add-player/add-player.component';
import { PlayersDetailComponent } from './players/players-detail/players-detail.component';
import { PlayersComponent } from './players/players.component';
import { TeamComponent } from './team/team.component';

const routes: Routes = [
  {path:'', redirectTo:'/players', pathMatch:"full"},
  {path:'players', component:PlayersComponent, canActivate: [AuthGuard], children:[
    {path:'new', component: AddPlayerComponent},
    {path:':id', component: PlayersDetailComponent},
    {path:'edit/:id', component: AddPlayerComponent},
  ]},
  {path:'team', component:TeamComponent, canActivate: [AuthGuard]},
  {path:'auth', component:AuthComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
