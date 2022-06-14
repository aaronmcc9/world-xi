import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth/auth.component';
import { AddPlayerComponent } from './players/add-player/add-player.component';
import { PlayersDetailComponent } from './players/players-detail/players-detail.component';
import { PlayersComponent } from './players/players.component';
import { TeamComponent } from './team/team.component';

const routes: Routes = [
  {path:'', redirectTo:'/players', pathMatch:"full"},
  {path:'players', component:PlayersComponent, children:[
    {path:'new', component: AddPlayerComponent},
    {path:':id', component: PlayersDetailComponent},
    {path:'edit/:id', component: AddPlayerComponent},
  ]},
  {path:'team', component:TeamComponent},
  {path:'auth', component:AuthComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
