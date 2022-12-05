import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Position } from 'src/app/players/player-position';
import { Player } from 'src/app/players/player.model';
import { PlayersApiService } from 'src/app/players/players-api.service';
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
  playerToModifySubscription = new Subscription();
  playerToModify: Player | null = null;
  
  players: Player[] = [];
  error = '';
  loading = false;

  playerLimit = 4;
  page = 1;
  listStart = 0;

  //icons
  selectIcon = faUpRightFromSquare

  constructor(private playersApiService: PlayersApiService, private positionService: PositionService,
    private teamService: TeamService) { }

  ngOnInit(): void {

    this.players = this.playersApiService.players
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

    this.playerToModifySubscription = this.teamService.playerToModify.subscribe((playerToModify: Player | null) => {
      this.playerToModify = playerToModify;
    });
  }

  ngOnDestroy(): void {
    this.pageSubscription.unsubscribe()
    this.playerToModifySubscription.unsubscribe();
  };

  fetchPlayers() {
    this.loading = true;

    this.playersApiService.fetchAllPlayers()
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
    if (!this.playerToModify)
      this.teamService.playerToModify.next(player);
  }
}
