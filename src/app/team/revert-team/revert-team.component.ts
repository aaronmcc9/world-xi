import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { TeamApiService } from 'src/app/api/team/team-api.service';
import { PlayerDto } from 'src/app/players/player.dto';
import { Team } from '../team.model';
import { TeamService } from '../team.service';

export interface RevertTeamOptions{
    action:string;
    formation?:number;
}

@Component({
  selector: 'app-revert-team',
  templateUrl: './revert-team.component.html',
  styleUrls: ['./revert-team.component.css']
})
export class RevertTeamComponent implements OnInit {

  @Input('action') action: string = '';
    @Output() closeModal = new EventEmitter<RevertTeamOptions>();
  
  team: Team | null = null;
  title = '';
  body = '';
  error = ''
  

  constructor(private teamService: TeamService,
    private teamApiService: TeamApiService,
    private alertService: AlertService,
    private translateService: TranslateService) { }

  ngOnInit(): void {

    this.teamService.savedTeam.subscribe((team) => {
      this.team = team;
    })

    if (this.action === this.translateService.instant("CANCEL")) {
      this.title = this.translateService.instant("CANCEL_CHANGES");
      this.body = this.translateService.instant("CANCEL_CHANGES_CONFIRMATION")
    }
    else {
      this.title = this.translateService.instant("RESET_TEAM");
      this.body = this.translateService.instant("RESET_TEAM_CONFIRMATION");
    }
  }

  confirm() {
    this.action == this.translateService.instant("CANCEL") ?
      this.cancelChanges() :
      this.reset();
  }

  cancelChanges() {

    //if a saved team doesn't exist, reset everyone
    if (!this.team)
      this.reset();
    else {
      this.teamService.setPlayersByPosition(this.team.players);
      this.close(this.team.formation.id, false);
    }
  }

  async reset() {
    let formation = this.teamService.getDefaultFormation()

    if (this.team) {
        formation = this.team.formation;
    //   try {
    //     const result = await lastValueFrom(this.teamApiService.deleteTeam());

    //     if (result.success) {
    //       this.alertService.toggleAlert("ALERT_TEAM_DELETE_SUCCESS", AlertType.Success);
    //     }
    //     else {
    //       this.throwDeleteFailure();
    //     }
    //   }
    //   catch (e) {
    //     this.throwDeleteFailure();
    //   }
    }

      this.teamService.setPlayersInPosition(new Array<PlayerDto>(1), new Array<PlayerDto>(+formation.structure[0]), new Array<PlayerDto>(+formation.structure[1]), new Array<PlayerDto>(+formation.structure[2]));
      this.close(formation.id, true);
  }

  close(formation: number, allowCancel: boolean) {
    if (!allowCancel || formation)
      this.teamService.canCancelChanges = allowCancel;

    this.closeModal.emit({
        action: '',
        formation:  formation
    });
  }

  throwDeleteFailure() {
    this.alertService.toggleAlert("ALERT_TEAM_DELETE_FAILURE", AlertType.Danger);
    throw Error(this.translateService.instant("ALERT_TEAM_DELETE_FAILURE"));
  }
}
