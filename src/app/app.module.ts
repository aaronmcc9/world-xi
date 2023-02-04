import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PlayersApiService } from './api/players/players-api.service';
import { AuthInterceptorService } from './auth/auth/auth.interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PlayersModule } from './players/players.module';
import { AuthModule } from './auth/auth/auth.module';
import { AppCommonModule } from './app-common.module';
import { TeamModule } from './team/team.module';
import { HeaderComponent } from './header/header/header.component';
import { SettingsModule } from './settings/settings/settings.module';
import { ExploreModule } from './explore/explore.module';
import { TeamListItemComponent } from './explore/team-list-item/team-list-item.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    AppCommonModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    ExploreModule,
    HttpClientModule,
    PlayersModule,
    SettingsModule,
    TeamModule,
    TranslateModule.forRoot({
      defaultLanguage: 'common-en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [PlayersApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
