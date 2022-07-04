import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../player.model';
import { PlayersService } from '../players.service';
import { faCircleCheck, faXmark, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.css']
})
export class PlayersListComponent implements OnInit, OnDestroy {
  players: Player[] = [];
  subscription: Subscription = new Subscription();
  error = '';
  isLoading = false;

  //icons
  selectedIcon = faCircleCheck;
  absentIcon = faXmark;
  openIcon = faUpRightFromSquare

  constructor(private playerService: PlayersService, private router: Router) { }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;  

    this.subscription = this.playerService.playersChanged.subscribe(players => {
      return this.players = players;
    })

    this.playerService.fetchAllPlayers()
      .subscribe({
        next: responseData => {
          this.players = responseData;
          this.isLoading = false;

          console.log(this.players)
        },
        error: errorMessage => {
          this.isLoading = false;
          this.error = errorMessage;
        }
      });
  }

}
