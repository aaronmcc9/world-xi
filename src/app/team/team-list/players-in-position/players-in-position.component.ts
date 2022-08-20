import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Position } from 'src/app/players/player-position';
import { Player } from 'src/app/players/player.model';
import { PlayersService } from 'src/app/players/players.service';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { PositionService } from 'src/app/players/position.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-players-in-position',
  templateUrl: './players-in-position.component.html',
  styleUrls: ['./players-in-position.component.css']
})
export class PlayersInPositionComponent implements OnInit, OnDestroy {
  @Input('position') position: string = Position[0];
  positionSubscription = new Subscription();

  players: Player[] = [];
  error = '';
  loading = false;
  playerLimit = 4;

  //icons
  selectIcon = faUpRightFromSquare

  constructor(private playersService: PlayersService, private positionService: PositionService) { }

  ngOnInit(): void {

    this.players = this.playersService.players
      .filter(p => {
        return p.position == this.position;
      });


    if (this.players === null || this.players.length === 0) {
      this.fetchPlayers();
    }

    this.playerLimit = this.positionService.teamListPosition.getValue() ? 15 : 4;
  }

  fetchPlayers() {
    this.loading = true;

    this.playersService.fetchAllPlayers()
      .subscribe({
        next: players => {

          this.players = players.filter(p => {
            return p.position == this.position;
          });

          this.loading = false;
        },
        error: message => {
          this.error = message;
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.positionSubscription.unsubscribe();
  }

}
