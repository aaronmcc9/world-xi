import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth/auth.component';
import { AuthGuard } from './auth/auth/auth.guard';
import { ExploreComponent } from './explore/explore.component';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { SettingsComponent } from './settings/settings/settings.component';
import { TeamComponent } from './team/team.component';

const routes: Routes = [
  { path: '', redirectTo: '/players', pathMatch: "full" },
  { path: 'team/:id', component: TeamComponent, canActivate: [AuthGuard], },
  { path: 'explore', component: ExploreComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsListComponent,canActivate: [AuthGuard] },
  { path: 'notifications/:id', component: NotificationsListComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
