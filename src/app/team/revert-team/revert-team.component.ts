import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-revert-team',
  templateUrl: './revert-team.component.html',
  styleUrls: ['./revert-team.component.css']
})
export class RevertTeamComponent implements OnInit {

  @Input('action') action: string = '';
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

  }

  cancelChanges() {
    let savedTeam = this.teamService.savedTeam;

    if (!savedTeam)
      this.reset();

    this.teamService.setPlayersByPosition(savedTeam['players']);
  }

  reset() {
    let savedFormation = this.teamService.savedTeam['formation'] ?
      this.teamService.savedTeam['formation'] : '442';
  }

  close(){
    
  }

}
