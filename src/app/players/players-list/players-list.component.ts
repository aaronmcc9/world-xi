import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../player.model';
import { PlayersApiService } from '../players-api.service';
import { faCircleCheck, faXmark, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Input } from '@angular/core';
import { ColumnService } from 'src/app/columns.service';

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

  @Input() cols = 2;
  screenSize = ""

  constructor(private playersApiService: PlayersApiService, private router: Router,
    private columnService: ColumnService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;

    //tracks current screen size
    this.columnService.screenSize.subscribe((screenSize) => {
      this.screenSize = screenSize;
    });

    this.subscription = this.playersApiService.playersChanged.subscribe(players => {
      return this.players = players;
    })

    this.playersApiService.fetchAllPlayers()
      .subscribe({
        next: (players: Player[]) => {
          console.log(players);
          this.players = players;
          this.isLoading = false;
        },
        error: (errorMessage) => {
          console.log("Here", errorMessage);
          this.isLoading = false;
          this.error = errorMessage;
        }
      });
  }

}
