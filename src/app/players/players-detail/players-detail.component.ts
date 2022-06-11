import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from '../player.model';
import { PlayersService } from '../players.service';

@Component({
  selector: 'app-players-detail',
  templateUrl: './players-detail.component.html',
  styleUrls: ['./players-detail.component.css']
})
export class PlayersDetailComponent implements OnInit {
  playerId: string = '';
  player: Player = <Player>{};
  error: string = '';
  isLoading = false;


  constructor(private activatedRoute: ActivatedRoute,
    private playersService: PlayersService,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params) => {

        this.playerId = params['id'];

        if (this.playerId) {
          this.isLoading = true;

          this.playersService.fetchPlayerById(this.playerId)
            .subscribe({
              next: playerRes => {
                this.player = playerRes;
                console.log(this.player);
                this.isLoading = false;

              },
              error: errorMessage => {
                this.error = errorMessage;
                this.isLoading = false;

                console.log("here", errorMessage);
              }
            });
        }
        else {
          this.error = "Unable to retrieve player ID. Please Try again."
        }

      }
    )
  }

  onDeletePlayer() {
    this.isLoading = true;

    if (this.playerId) {
      this.playersService.deletePlayer(this.playerId)
        .subscribe({
          next: res => {
            this.isLoading = false;
            this.router.navigate(['']);
          },
          error: errorMessage => {
            this.isLoading = false;
            this.error = errorMessage;
          }
        });
    }
  }

}
