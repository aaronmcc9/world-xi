import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { Player } from '../player.model';
import { PlayersApiService } from '../../api/players/players-api.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-players-detail',
  templateUrl: './players-detail.component.html',
  styleUrls: ['./players-detail.component.css']
})
export class PlayersDetailComponent implements OnInit {
  playerId: number = 0;
  player: Player = <Player>{};
  error: string = '';
  isLoading = false;
  deleteModalVisible = false;


  constructor(private activatedRoute: ActivatedRoute,
    private playersApiService: PlayersApiService,
    private alertService: AlertService) { }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(
      async (params) => {

        this.playerId = +params['id'];

        if (this.playerId) {
          this.isLoading = true;

          try {
            const result = await lastValueFrom(this.playersApiService.fetchPlayerById(this.playerId));

            if (result.data)
              this.player = result.data;
            else
              this.alertService.toggleAlert('ALERT_PLAYER_NOT_FOUND', AlertType.Danger)

            this.isLoading = false;
          }
          catch (e) {
            this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYER', AlertType.Danger)
          }

          // this.playersApiService.fetchPlayerById(this.playerId)
          //   .subscribe({
          //     next: playerRes => {
          //       this.player = playerRes;
          //       this.isLoading = false;

          //     },
          //     error: errorMessage => {
          //       this.error = errorMessage;
          //       this.isLoading = false;
          //     }
          //   });
        }
        else {
          this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYER', AlertType.Danger)
        }

      }
    )
  }

  toggleDeletePlayer(open: boolean) {
    this.isLoading = open;
    this.deleteModalVisible = open
  }

}
