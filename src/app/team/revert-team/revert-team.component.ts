import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { TeamApiService } from 'src/app/api/team/team-api.service';
import { Player } from 'src/app/players/player.model';
import { Team } from '../team.model';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-revert-team',
  templateUrl: './revert-team.component.html',
  styleUrls: ['./revert-team.component.css']
})
export class RevertTeamComponent implements OnInit {

  @Input('action') action: string = '';
  @Output() closeModal = new EventEmitter<string>();
  title = '';
  body = '';
  error = ''

  constructor(private teamService: TeamService,
    private teamApiService: TeamApiService,
    private translateService: TranslateService) { }

  ngOnInit(): void {

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
    let savedTeam = this.teamService.savedTeam.id > 0 ?
      cloneDeep(this.teamService.savedTeam) : null;
    
       this.action == this.translateService.instant("CANCEL") ?
      this.cancelChanges(savedTeam) :
      this.reset(savedTeam);
  }

  cancelChanges(savedTeam: Team | null) {

    //if a saved team doesn't exist, reset everyone
    if (!savedTeam)
      this.reset(null);
    else {
      this.teamService.setPlayersByPosition(savedTeam['players']);
      this.close('', false);
    }
  }

  reset(savedTeam: Team | null) {
    let formation = this.teamService.getDefaultFormation()

    // will be false if sent here form cancelChanges
    if (savedTeam) {
      formation = savedTeam['formation'].id;
      this.teamApiService.deleteTeam();
    }
    else {
      this.teamService.setPlayersInPosition(new Array<Player>(1), new Array<Player>(4), new Array<Player>(4), new Array<Player>(2));
    }

    this.close(formation.toString(), true);
  }

  close(formation: string, allowCancel: boolean) {
    if (!allowCancel || formation)
      this.teamService.canCancelChanges = allowCancel;

    this.closeModal.emit(formation);
  }
}
