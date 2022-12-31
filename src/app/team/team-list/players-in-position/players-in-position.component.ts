import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Position } from 'src/app/players/player-position';
import { Player } from 'src/app/players/player.model';
import { PlayersApiService } from 'src/app/api/players/players-api.service';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { PositionService } from 'src/app/players/position.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { TeamService } from '../../team.service';
import { AlertService } from 'src/app/alert/alert.service';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { PlayerService } from 'src/app/players/player.service';

@Component({
  selector: 'app-players-in-position',
  templateUrl: './players-in-position.component.html',
  styleUrls: ['./players-in-position.component.css']
})
export class PlayersInPositionComponent implements OnInit, OnDestroy {

  @Input('position') position: Position = Position.Goalkeeper;
  pageSubscription = new Subscription();
  playerToModifySubscription = new Subscription();
  playerToModify: Player | null = null;

  players: Player[] = [];
  error = '';
  isLoading = false;

  playerLimit = 4;
  page = 1;
  listStart = 0;

  //icons
  selectIcon = faUpRightFromSquare

  constructor(private playersApiService: PlayersApiService, private positionService: PositionService,
    private teamService: TeamService, private alertService: AlertService,
    private playerService: PlayerService) { }

  async ngOnInit(): Promise<void> {

    this.players = this.playerService.players
      .getValue();

    if (this.players.length === 0)
      await this.fetchPlayers();
    
    this.players = this.players.filter((p: Player) => {
      return p.position == this.position;
    });

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

  async fetchPlayers() {
    this.isLoading = true;

    try {
      const result = await lastValueFrom(this.playersApiService.fetchAllPlayers());

      if (result.data) {
        this.playerService.players.next(result.data);
        this.players = result.data;
      }

      this.isLoading = false;
    }
    catch(e) {
      this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYERS', AlertType.Danger)
      this.isLoading = false;
    }
  }

  modifyPlayer(player: Player) {
    if (!this.playerToModify)
      this.teamService.playerToModify.next(player);
  }
}
