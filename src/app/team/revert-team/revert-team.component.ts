import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
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

  constructor(private teamService: TeamService) { }

  ngOnInit(): void {

    if (this.action === "Cancel") {
      this.title = "Cancel Changes";
      this.body = "Are you sure you want to cancel your new changes?"
    }
    else {
      this.title = "Reset Team";
      this.body = "Are you sure you want to reset your whole team?"
    }
  }

  confirm() {
    this.action ?
      this.cancelChanges() :
      this.reset();
  }

  cancelChanges() {
    let savedTeam = cloneDeep(this.teamService.savedTeam);

    //if a saved team doesn't exist, reset everyone
    if (!savedTeam)
      this.reset();

    this.teamService.setPlayersByPosition(savedTeam['players']);
    this.close();
  }

  reset() {
    let savedFormation = this.teamService.savedTeam['formation'] ?
      this.teamService.savedTeam['formation'] : '442';
  }

  close() {
    this.closeModal.emit('');
  }
}
