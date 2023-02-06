import { Component, Input, OnChanges } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { TeamApiService } from 'src/app/api/team/team-api.service';
import { Team } from 'src/app/team/team.model';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnChanges {
  
  @Input("friends") friends = false;
  teams: Team[] = [];
  constructor(private teamApiService: TeamApiService, private alertService: AlertService) { }

  async ngOnChanges(): Promise<void> {
    await this.reset(this.friends);
  }

  async reset(friends: boolean, filterText?: string) {
    await this.fetchTeams(friends, filterText);
  }

  async fetchTeams(friends: boolean, filterText?: string) {
    try {
      const result = await lastValueFrom(this.teamApiService.fetchAllTeams(friends, filterText));

      if (result.success){
        this.teams = result.data;
      }
      else{
        this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_TEAMS', AlertType.Danger, result.message)
      }

    }
    catch (e) {
      this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_TEAMS', AlertType.Danger);
    }
  }

}
