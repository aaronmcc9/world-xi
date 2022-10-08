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
import { TeamComponent } from './team/team.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ErrorComponent } from './error/error.component';
import { PlayersService } from './players/players.service';
import { AuthInterceptorService } from './auth/auth/auth.interceptor.service';
import { TeamListComponent } from './team/team-list/team-list.component';
import { PlayersInPositionComponent } from './team/team-list/players-in-position/players-in-position.component';
import { FormationRowComponent } from './team/formation-row/formation-row.component';
import { ModifySelectionComponent } from './team/modify-selection/modify-selection.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    PlayersComponent,
    PlayersListComponent,
    PlayersDetailComponent,
    AddPlayerComponent,
    TeamComponent,
    ErrorComponent,
    TeamListComponent,
    PlayersInPositionComponent,
    FormationRowComponent,
    ModifySelectionComponent,
    LoadingSpinnerComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule
  ],
  providers: [PlayersService,
  {provide: HTTP_INTERCEPTORS,
    useClass:AuthInterceptorService,
    multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
