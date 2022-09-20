import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
export class ModifySelectionComponent implements OnInit, OnDestroy {

  player: Player | null = null;
  action: string = '';
  error: string = '';

  @Input('defenceCount') defenceCount = 1;
  @Input('midfieldCount') midfieldCount = 1;
  @Input('forwardCount') forwardCount = 1;

  playerToModifySubscription = new Subscription();


  constructor(private teamService: TeamService) { }

  ngOnInit(): void {

    this.playerToModifySubscription = this.teamService.playerToModify.subscribe((player: Player | null) => {
      this.player = player;
    });

    this.action = this.player?.isSelected ? SelectionAction[SelectionAction.Remove]
      : SelectionAction[SelectionAction.Select];
  }

  ngOnDestroy(): void {
    this.playerToModifySubscription.unsubscribe();
  }

  endModification() {
    this.teamService.playerToModify.next(null);
  }

  changeSelectionStatus() {
    this.player!.isSelected = !this.player!.isSelected;
  }


  submit() {
    if (this.player) {
      this.changeSelectionStatus();
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
          this.endModification();
        }

        break;

      case Position[Position.Defender]:
        let defence = this.teamService.teamDefence.getValue();

        if (this.action == SelectionAction[SelectionAction.Select]) {

          //filter out empty values
          let spotsTaken = defence.filter(Boolean).length;

          if (spotsTaken < this.defenceCount) {
            defence = this.addPlayer(defence, this.defenceCount - 1);
            this.endModification();
          }
        }
        else {
          defence = this.removePlayer(defence);
          this.endModification();
        }

        this.teamService.teamDefence.next(defence);
        break;

      case Position[Position.Midfield]:
        let midfield = this.teamService.teamMidfield.getValue();

        if (this.action == SelectionAction[SelectionAction.Select]) {
          //filter out empty values
          let spotsTaken = midfield.filter(Boolean).length;

          if (spotsTaken < this.midfieldCount) {
            midfield = this.addPlayer(midfield, this.midfieldCount - 1);;
            this.endModification();
          }
        }
        else {
          midfield = this.removePlayer(midfield);
          this.endModification();
        }

        this.teamService.teamMidfield.next(midfield);
        break;

      case Position[Position.Forward]:
        let forwards = this.teamService.teamForward.getValue();

        if (this.action == SelectionAction[SelectionAction.Select]) {
          //filter out empty values
          let spotsTaken = forwards.filter(Boolean).length;

          if (spotsTaken < this.forwardCount) {
            forwards = this.addPlayer(forwards, this.forwardCount - 1);
            this.endModification();
          }
        }
        else {
          forwards = this.removePlayer(forwards);
          this.endModification();
        }

        this.teamService.teamForward.next(forwards);
        break;
    }

    //player was unable to be added due to maximum reached for their position
    if (this.player != null) {
      this.changeSelectionStatus(); //revert initial selection change
      this.error = "Please remove an existing player in the " + this.player.position + " position to complete the selection."
    }
  }

  private addPlayer(players: (Player | undefined)[],
    end: number): (Player | undefined)[] {

    let start = 0;

    while (start < end) {

      let mid = Math.round(end / 2);

      if (players[mid] === undefined) {
        players[mid] = this.player!;
        break
      }
      else if (players[start] === undefined) {
        players[start] = this.player!;
        break
      }
      else if (players[end] === undefined) {
        players[end] = this.player!;
        break
      }

      start++;
      end--;
    }

    return players;
  }

  private removePlayer(players: (Player | undefined)[]): (Player | undefined)[] {
    let idx = players.findIndex((player: Player | undefined) => {
      return player?.id == this.player?.id;
    });

    players[idx] = undefined;
    return players;
  }
}
