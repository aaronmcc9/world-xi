import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { Player } from 'src/app/players/player.model';
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
    this.action == 'Cancel' ?
      this.cancelChanges() :
      this.reset();
  }

  cancelChanges() {
    let savedTeam = cloneDeep(this.teamService.savedTeam);

    //if a saved team doesn't exist, reset everyone
    if (!savedTeam)
      this.reset();
    else {
      this.teamService.setPlayersByPosition(savedTeam['players']);
      this.close('');
    }
  }

  reset() {
    let savedFormation = this.teamService.savedTeam['formation'] ?
      this.teamService.savedTeam['formation'] : '442';

    this.teamService.teamGoalkeeper.next(new Array<(Player | undefined)>(1))
    this.teamService.teamDefence.next(new Array<(Player | undefined)>(+savedFormation[0]))
    this.teamService.teamMidfield.next(new Array<(Player | undefined)>(+savedFormation[1]))
    this.teamService.teamForward.next(new Array<(Player | undefined)>(+savedFormation[2]))

    this.close(savedFormation);
  }

  close(formation: string) {
    this.closeModal.emit(formation);
  }
}
