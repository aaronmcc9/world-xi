import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth/auth.guard";
import { AddPlayerComponent } from "./add-player/add-player.component";
import { PlayersDetailComponent } from "./players-detail/players-detail.component";
import { PlayersComponent } from "./players.component";


const routes: Routes = [
    {path:'players', component:PlayersComponent, canActivate: [AuthGuard], children:[
      {path:'new', component: AddPlayerComponent},
      {path:':id', component: PlayersDetailComponent},
      {path:'edit/:id', component: AddPlayerComponent},
    ]},
  ];

@NgModule({
    declarations:[],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlayersRoutingModule{

}