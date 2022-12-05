import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { Player } from '../player.model';
import { PlayersApiService } from '../players-api.service';

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

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params) => {

        this.playerId = +params['id'];

        if (this.playerId) {
          this.isLoading = true;

          this.playersApiService.fetchPlayerById(this.playerId)
            .subscribe({
              next: playerRes => {
                this.player = playerRes;
                this.isLoading = false;

              },
              error: errorMessage => {
                this.error = errorMessage;
                this.isLoading = false;
              }
            });
        }
        else {
          this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYER', AlertType.Danger)
          // this.error = "Unable to retrieve player ID. Please Try again."
        }

      }
    )
  }

  toggleDeletePlayer(open: boolean) {
    this.isLoading = open;
    this.deleteModalVisible = open
  }

}
