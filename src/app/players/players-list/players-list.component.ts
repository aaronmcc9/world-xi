import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../player.model';
import { PlayersService } from '../players.service';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.css']
})
export class PlayersListComponent implements OnInit {
  players: Player[] = [];
  error = null;
  isLoading = false;


  constructor(private playerService: PlayersService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.playerService.fetchAllPlayers()
      .subscribe({
        next: responseData => {
          this.players = <Player[]>responseData;
          this.isLoading = false;
        },
        error: errorMessage => {
          this.isLoading = false;
          this.error = errorMessage;
          console.log("error", errorMessage);
        }
      });
  }

}
