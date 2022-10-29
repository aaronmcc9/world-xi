import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PlayersService } from './players/players.service';
import { AuthInterceptorService } from './auth/auth/auth.interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PlayersModule } from './players/players.module';
import { AuthModule } from './auth/auth/auth.module';
import { AppCommonModule } from './app-common.module';
import { TeamModule } from './team/team.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from './header/header/header.component';

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
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // MatGridListModule,
    // FlexLayoutModule,
    PlayersModule,
    AuthModule,
    TeamModule,
    TranslateModule.forRoot({
      defaultLanguage: 'common-en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule
  ],
  providers: [PlayersService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
