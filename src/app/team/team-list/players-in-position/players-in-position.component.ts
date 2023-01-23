import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Position } from 'src/app/players/player-position';
import { Player } from 'src/app/players/player.model';
import { PlayersApiService } from 'src/app/api/players/players-api.service';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, Subscription } from 'rxjs';
import { TeamService } from '../../team.service';
import { AlertService } from 'src/app/alert/alert.service';
import { AlertType } from 'src/app/alert/alert-type.enum';

@Component({
  selector: 'app-players-in-position',
  templateUrl: './players-in-position.component.html',
  styleUrls: ['./players-in-position.component.css']
})
export class PlayersInPositionComponent implements OnChanges, OnDestroy {

  @Output() totalPerPosition = new EventEmitter<number>(false);

  @Input('position') position: Position = Position.Goalkeeper;
  @Input('skip') skip = 0;
  @Input('take') take = 4;

  playerToModifySubscription = new Subscription();
  playerToModify: Player | null = null;

  players: Player[] = [];
  error = '';
  isLoading = false;

  page = 1;

  //icons
  selectIcon = faUpRightFromSquare

  constructor(private playersApiService: PlayersApiService,
    private teamService: TeamService, private alertService: AlertService) { }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    await this.fetchPlayersByPosition();
    console.log(changes)

    this.playerToModifySubscription = this.teamService.playerToModify.subscribe((playerToModify: Player | null) => {
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
        console.log(result.data)
        this.totalPerPosition.emit(result.data.total);
      }

      this.isLoading = false;
    }
    catch (e) {
      this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYERS', AlertType.Danger)
      this.isLoading = false;
    }
  }

  modifyPlayer(player: Player) {
    if (!this.playerToModify)
      this.teamService.playerToModify.next(player);
  }
}
