import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { Player } from '../player.model';
import { PlayersApiService } from '../../api/players/players-api.service';
import { lastValueFrom } from 'rxjs';
import { PositionService } from '../position.service';

@Component({
  selector: 'app-players-detail',
  templateUrl: './players-detail.component.html',
  styleUrls: ['./players-detail.component.css']
})
export class PlayersDetailComponent implements OnInit {
  player: Player = <Player>{};
  error: string = '';
  isLoading = false;
  deleteModalVisible = false;


  constructor(private activatedRoute: ActivatedRoute,
    private playersApiService: PlayersApiService,
    private alertService: AlertService,
    public positionService: PositionService) { }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(
      async (params) => {

        const playerId = +params['id'];

        if (playerId) {
          await this.fetchPlayer(playerId)
        }
        else {
          this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYER', AlertType.Danger)
        }

      }
    )
  }

  private async fetchPlayer(id:number): Promise<void>{
    this.isLoading = true;

    try {
      const result = await lastValueFrom(this.playersApiService.fetchPlayerById(id));

      if (result.data)
        this.player = result.data;
      else
        this.alertService.toggleAlert('ALERT_PLAYER_NOT_FOUND', AlertType.Danger)

      this.isLoading = false;
    }
    catch (e) {
      this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYER', AlertType.Danger)
    }
  }

  toggleDeletePlayer(open: boolean) {
    this.deleteModalVisible = open
  }

}
