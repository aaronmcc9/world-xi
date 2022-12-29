import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../player.model';
import { PlayersApiService } from '../../api/players/players-api.service';
import { faCircleCheck, faXmark, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, Subscription } from 'rxjs';
import { Input } from '@angular/core';
import { ColumnService } from 'src/app/columns.service';
import { AlertService } from 'src/app/alert/alert.service';
import { AlertType } from 'src/app/alert/alert-type.enum';

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
    private columnService: ColumnService, private alertService: AlertService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    //tracks current screen size
    this.columnService.screenSize.subscribe((screenSize) => {
      this.screenSize = screenSize;
    });

    this.subscription = this.playersApiService.playersChanged.subscribe(players => {
      return this.players = players;
    })

    // this.playersApiService.fetchAllPlayers()
    //   .subscribe({
    //     next: (players: Player[]) => {
    //       console.log(players);
    //       this.players = players;
    //       this.isLoading = false;
    //     },
    //     error: (errorMessage) => {
    //       console.log("Here", errorMessage);
    //       this.isLoading = false;
    //       this.error = errorMessage;
    //     }
    //   });
  }

  private async fetchPlayers() {
    try {
      this.isLoading = true;
      const result = await lastValueFrom(this.playersApiService.fetchAllPlayers());

      if (result.data) {
        this.players = result.data;
      }

      this.isLoading = false
    }
    catch (e) {
      this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYERS', AlertType.Danger)
      this.isLoading = false
    }
  }

}
