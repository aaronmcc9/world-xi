import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerDto } from '../player.dto';
import { PlayersApiService } from '../../api/players/players-api.service';
import { faCircleCheck, faXmark, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, Subscription } from 'rxjs';
import { Input } from '@angular/core';
import { ColumnService } from 'src/app/columns.service';
import { AlertService } from 'src/app/alert/alert.service';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { PlayerService } from '../player.service';
import { PositionService } from '../position.service';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.css']
})
export class PlayersListComponent implements OnInit, OnDestroy {
  players: PlayerDto[] = [];
  subscription: Subscription = new Subscription();
  error = '';
  isLoading = false;

  //icons
  selectedIcon = faCircleCheck;
  absentIcon = faXmark;
  openIcon = faUpRightFromSquare

  @Input() cols = 2;
  screenSize = ""

  constructor(private playersApiService: PlayersApiService, public positionService: PositionService,
    private columnService: ColumnService, private alertService: AlertService,
    private playerService: PlayerService,) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    //tracks current screen size
    this.columnService.screenSize.subscribe((screenSize) => {
      this.screenSize = screenSize;
    });

    this.subscription = this.playerService.players.subscribe((players: PlayerDto[]) => {
      return this.players = players;
    })

    if (this.players.length === 0)
      await this.fetchPlayers();
  }

  private async fetchPlayers() {
    try {
      this.isLoading = true;
      const result = await lastValueFrom(this.playersApiService.fetchAllPlayers());

      if (result.success) {
        this.playerService.players.next(result.data.items);
      }
      else {
        this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYERS', AlertType.Danger, result.message);
      }

      this.isLoading = false
    }
    catch (e) {
      this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYERS', AlertType.Danger)
      this.isLoading = false
    }
  }

}
