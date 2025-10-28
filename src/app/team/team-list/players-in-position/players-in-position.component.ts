import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Position } from 'src/app/players/player-position';
import { PlayerDto } from 'src/app/players/player.dto';
import { PlayersApiService } from 'src/app/api/players/players-api.service';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, Subscription } from 'rxjs';
import { TeamService } from '../../team.service';
import { AlertService } from 'src/app/alert/alert.service';
import { AlertType } from 'src/app/alert/alert-type.enum';

export interface PlayerPageTotals{
  total: number,
  totalOnPage: number
}

@Component({
  selector: 'app-players-in-position',
  templateUrl: './players-in-position.component.html',
  styleUrls: ['./players-in-position.component.css']
})
export class PlayersInPositionComponent implements OnChanges, OnDestroy {

  @Output() totalsPerPosition = new EventEmitter<PlayerPageTotals>();

  @Input('position') position: Position = Position.Goalkeeper;
  @Input('skip') skip = 0;
  @Input('take') take = 4;

  playerToModifySubscription = new Subscription();
  playerToModify: PlayerDto | null = null;

  players: PlayerDto[] = [];
  error = '';
  isLoading = false;

  page = 1;

  //icons
  selectIcon = faUpRightFromSquare

  constructor(private playersApiService: PlayersApiService,
    private teamService: TeamService, private alertService: AlertService) { }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    await this.fetchPlayersByPosition();

    this.playerToModifySubscription = this.teamService.playerToModify.subscribe((playerToModify: PlayerDto | null) => {
      this.playerToModify = playerToModify;
    });
  }

  ngOnDestroy(): void {
    this.playerToModifySubscription.unsubscribe();
  };

  async fetchPlayersByPosition() {
    this.isLoading = true;

    try {
      const result = await lastValueFrom(this.playersApiService
        .fetchPlayerByPosition(this.position, this.skip, this.take));

      if (result.data) {
        this.players = result.data.items;
        this.totalsPerPosition.emit({total: result.data.total, totalOnPage: result.data.items.length} as PlayerPageTotals);
      }

      this.isLoading = false;
    }
    catch (e) {
      this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYERS', AlertType.Danger)
      this.isLoading = false;
    }
  }

  modifyPlayer(player: PlayerDto) {
    if (!this.playerToModify)
      this.teamService.playerToModify.next(player);
  }
}
