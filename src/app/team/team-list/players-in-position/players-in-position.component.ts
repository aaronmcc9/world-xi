import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Position } from 'src/app/players/player-position';
import { Player } from 'src/app/players/player.model';
import { PlayersService } from 'src/app/players/players.service';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { PositionService } from 'src/app/players/position.service';
import { Subscription } from 'rxjs';
import { TeamService } from '../../team.service';

@Component({
  selector: 'app-players-in-position',
  templateUrl: './players-in-position.component.html',
  styleUrls: ['./players-in-position.component.css']
})
export class PlayersInPositionComponent implements OnInit, OnDestroy {

  @Input('position') position: string = Position[0];
  pageSubscription = new Subscription();

  players: Player[] = [];
  error = '';
  loading = false;

  playerLimit = 4;
  page = 1;
  listStart = 0;

  //icons
  selectIcon = faUpRightFromSquare

  constructor(private playersService: PlayersService, private positionService: PositionService,
    private teamService: TeamService) { }

  ngOnInit(): void {

    this.players = this.playersService.players
      .filter(p => {
        return p.position == this.position;
      });

    if (this.players === null || this.players.length === 0) {
      this.fetchPlayers();
    }

    //track pages of players
    this.pageSubscription = this.teamService.page.subscribe((page) => {

      this.page = page;
      this.playerLimit = this.positionService.teamListPosition.getValue() ? 16 : 4;

      if (page === 1) {
        this.listStart = this.playerLimit;
      }

      this.listStart = this.playerLimit * (this.page - 1);
      this.playerLimit = this.page * this.playerLimit;
    });
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

  modifyPlayer(player: Player) {
    this.teamService.playerToModify.next(player);
  }

  ngOnDestroy(): void {
    this.pageSubscription.unsubscribe()
  };

}