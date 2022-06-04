import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header/header.component';
import { AuthComponent } from './auth/auth/auth.component';
import { PlayersComponent } from './players/players.component';
import { PlayersListComponent } from './players/players-list/players-list.component';
import { PlayersDetailComponent } from './players/players-detail/players-detail.component';
import { AddPlayerComponent } from './players/add-player/add-player.component';
import { PlayerEditComponent } from './players/player-edit/player-edit.component';
import { TeamComponent } from './team/team.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    PlayersComponent,
    PlayersListComponent,
    PlayersDetailComponent,
    AddPlayerComponent,
    PlayerEditComponent,
    TeamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
