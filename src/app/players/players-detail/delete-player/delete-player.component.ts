import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { Player } from '../../player.model';
import { PlayersApiService } from '../../../api/players/players-api.service';
import { lastValueFrom } from 'rxjs';
import { PlayerService } from '../../player.service';

@Component({
  selector: 'app-delete-player',
  templateUrl: './delete-player.component.html',
  styleUrls: ['./delete-player.component.css']
})
export class DeletePlayerComponent implements OnInit {

  @Input() player: Player | null = null;
  @Output() closeModal = new EventEmitter<boolean>();
  isLoading = false;

  constructor(private playersApiService: PlayersApiService, private translateService: TranslateService,
    private router: Router, private alertService: AlertService,
    private playerService: PlayerService,
  ) { }
  action = this.translateService.instant('DELETE');


  ngOnInit(): void {
  }

  async confirm(): Promise<void> {
    this.isLoading = true;
    try {
      const result = await lastValueFrom(this.playersApiService.deletePlayer(this.player?.id!));

      if (result.data) {
        this.playerService.players.next(result.data);

        this.alertService.toggleAlert('PLAYER_DELETED', AlertType.Info, '',
          { firstName: this.player?.firstName, lastName: this.player?.lastName });

        this.router.navigate(['']);
        this.closeModal.emit(true);
      }

      this.isLoading = false;
    }
    catch (e) {
      this.isLoading = false;
      this.alertService.toggleAlert('ERROR_PLAYER_DELETE', AlertType.Danger, '',
        { firstName: this.player?.firstName, lastName: this.player?.lastName });
    }
    // this.playersApiService.deletePlayer(this.player?.id!)
    //   .subscribe({
    //     next: () => {
    //       this.alertService.toggleAlert('PLAYER_DELETED', AlertType.Info, '',
    //         { firstName: this.player?.firstName, lastName: this.player?.lastName });

    //       this.router.navigate(['']);
    //       this.closeModal.emit(true);
    //     },
    //     error: (errorMessage: string) => {
    //       this.alertService.toggleAlert('ERROR_PLAYER_DELETE', AlertType.Danger, errorMessage,
    //         { firstName: this.player?.firstName, lastName: this.player?.lastName });
    //       // this.error = errorMessage;
    //     }
    //   });
  }

  close() {
    this.closeModal.emit();
  }

}
