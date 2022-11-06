import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth/auth.guard";
import {  ModifyPlayerComponent } from "./add-player/modify-player.component";
import { PlayersDetailComponent } from "./players-detail/players-detail.component";
import { PlayersComponent } from "./players.component";


const routes: Routes = [
    {path:'players', component:PlayersComponent, canActivate: [AuthGuard], children:[
      {path:'new', component: ModifyPlayerComponent},
      {path:':id', component: PlayersDetailComponent},
      {path:'edit/:id', component: ModifyPlayerComponent},
    ]},
  ];

@NgModule({
    declarations:[],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlayersRoutingModule{

}