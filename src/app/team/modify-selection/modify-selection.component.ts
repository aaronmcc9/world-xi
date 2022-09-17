import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Position } from 'src/app/players/player-position';
import { Player } from 'src/app/players/player.model';
import { SelectionAction } from '../selection-action';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-modify-selection',
  templateUrl: './modify-selection.component.html',
  styleUrls: ['./modify-selection.component.css']
})
export class ModifySelectionComponent implements OnInit {

  player: Player | null = null;
  action: string = '';
  error: string = '';

  @Input('defenceCount') defenceCount = 1;
  @Input('midfieldCount') midfieldCount = 1;
  @Input('forwardCount') forwardCount = 1;


  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    this.player = this.teamService.playerToModify.getValue();
    this.action = this.player?.isSelected ? SelectionAction[SelectionAction.Remove]
      : SelectionAction[SelectionAction.Select];
  }

  endModification() {
    this.teamService.playerToModify.next(null);
  }


  submit() {
    if (this.player) {
      this.player.isSelected = !this.player.isSelected;
      this.modifyPlayer()
    }
  }

  private modifyPlayer() {

    switch (this.player!.position) {
      case Position[Position.Goalkeeper]:

        if (this.action == SelectionAction[SelectionAction.Select]) {
          let goalkeeper = this.teamService.teamGoalkeeper.getValue();
          //only will ever be one goalkeeper
          if (goalkeeper[0] === undefined) {
            this.teamService.teamGoalkeeper.next(new Array<Player>(this.player!));
            this.endModification();
          }
        } //Remove player
        else {

          this.teamService.teamGoalkeeper.next(new Array(1));
          this.teamService.playerToModify.next(null);
        }

        break;

      case Position[Position.Defender]:
        let defence = this.teamService.teamDefence.getValue();

        if (this.action == SelectionAction[SelectionAction.Select]) {

          //filter out empty values
          let spotsTaken = defence.filter(Boolean).length;

          if (spotsTaken < this.defenceCount) {
            defence[spotsTaken] = this.player!;
          }
          else {
            defence = this.removePlayer(defence);
          }

          this.teamService.teamDefence.next(defence);
          this.endModification();
        }
        break;

      case Position[Position.Midfield]:
        let midfield = this.teamService.teamMidfield.getValue();

        if (this.action == SelectionAction[SelectionAction.Select]) {
          //filter out empty values
          let spotsTaken = midfield.filter(Boolean).length;

          if (spotsTaken < this.midfieldCount) {
            midfield[spotsTaken] = this.player!;
          }
        }
        else {
          // let idx = midfield.findIndex((player: Player) => {
          //   return player.id == this.player?.id;
          // });

          // midfield[idx] = ;
          //console.log(midfield);
        }

        this.teamService.teamMidfield.next(midfield);
        this.endModification();
        break;

      case Position[Position.Forward]:
        let forwards = this.teamService.teamForward.getValue();

        if (this.action == SelectionAction[SelectionAction.Select]) {
          //filter out empty values
          let spotsTaken = forwards.filter(Boolean).length;

          if (spotsTaken < this.forwardCount) {
            forwards[spotsTaken] = this.player!;
          }
        }
        else {
          forwards = this.removePlayer(forwards);
        }

        this.teamService.teamForward.next(forwards);
        this.endModification();
        break;
    }

    if (this.player != null) {
      this.error = "Please remove an existing player in the " + this.player.position + " position to complete the selection."
    }
  }

  private removePlayer(players: Player[]): Player[] {
    return players.filter((player) => {
      return player.id !== this.player!.id;
    });
  }
}
