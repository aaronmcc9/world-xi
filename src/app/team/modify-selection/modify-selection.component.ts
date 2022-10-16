import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
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
  isPlayerSelected = false;
  playersInPositionCount = 1;

  @Input('defenceCount') defenceCount = 1;
  @Input('midfieldCount') midfieldCount = 1;
  @Input('forwardCount') forwardCount = 1;

  playerToModifySubscription = new Subscription();
  playersListToModifySubscription = new BehaviorSubject<(Player | undefined)[]>(new Array<Player>(4));


  constructor(private teamService: TeamService, private alertService: AlertService) { }

  ngOnInit(): void {

    this.playerToModifySubscription = this.teamService.playerToModify.subscribe((player: Player | null) => {
      this.player = player;
    });

    switch (this.player!.position) {
      case Position[Position.Goalkeeper]:

        //checks current selected players for the position
        this.isPlayerSelected = this.isPlayerSelected = this.teamService.teamGoalkeeper.getValue().filter((player) => (player?.id === this.player?.id)).length == 1;

        //sets appropriate action based on selection result
        this.action = this.isPlayerSelected ? SelectionAction[SelectionAction.Remove]
          : SelectionAction[SelectionAction.Select];

        this.playersInPositionCount = 1;
        this.playersListToModifySubscription = this.teamService.teamGoalkeeper;
        break;

      case Position[Position.Defender]:
        //checks current selected players for the position
        this.isPlayerSelected = this.teamService.teamDefence.getValue().filter((player) => (player?.id === this.player?.id)).length == 1;

        //sets appropriate action based on selection result
        this.action = this.isPlayerSelected ? SelectionAction[SelectionAction.Remove]
          : SelectionAction[SelectionAction.Select];

        this.playersInPositionCount = this.defenceCount;
        this.playersListToModifySubscription = this.teamService.teamDefence;
        break;

      case Position[Position.Midfield]:
        //checks current selected players for the position
        this.isPlayerSelected = this.teamService.teamMidfield.getValue().filter((player) => (player?.id === this.player?.id)).length == 1;

        //sets appropriate action based on selection result
        this.action = this.isPlayerSelected ? SelectionAction[SelectionAction.Remove]
          : SelectionAction[SelectionAction.Select];

        this.playersInPositionCount = this.midfieldCount;
        this.playersListToModifySubscription = this.teamService.teamMidfield;
        break;

      case Position[Position.Forward]:
        //checks current selected players for the position
        this.isPlayerSelected = this.teamService.teamForward.getValue().filter((player) => (player?.id === this.player?.id)).length == 1;

        //sets appropriate action based on selection result
        this.action = this.isPlayerSelected ? SelectionAction[SelectionAction.Remove]
          : SelectionAction[SelectionAction.Select];

        this.playersInPositionCount = this.forwardCount;
        this.playersListToModifySubscription = this.teamService.teamForward;
        break;
    }
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
    let playersInPosition = this.playersListToModifySubscription.getValue()
    if (this.action == SelectionAction[SelectionAction.Select]) {

      //filter out empty values
      let spotsTaken = playersInPosition.filter(Boolean).length;

      if (spotsTaken < this.playersInPositionCount) {
        //if one is for goalkeeper
        this.playersInPositionCount === 1 ?
          playersInPosition[0] = this.player! :
          playersInPosition = this.addPlayer(playersInPosition, this.playersInPositionCount - 1);

        this.endModification();
      }
    }
    else {
      playersInPosition = this.removePlayer(playersInPosition);
      this.endModification();
    }

    this.playersListToModifySubscription.next(playersInPosition);

    //player was unable to be added due to maximum reached for their position
    if (this.player != null) {
      this.changeSelectionStatus(); //revert initial selection change
      this.alertService.toggleAlert("Please remove an existing player in the " + this.player.position + " position to complete the selection.",
        AlertType.Danger);
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
