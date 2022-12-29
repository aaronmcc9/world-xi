import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { Player } from '../../player.model';
import { PlayersApiService } from '../../../api/players/players-api.service';

@Component({
  selector: 'app-delete-player',
  templateUrl: './delete-player.component.html',
  styleUrls: ['./delete-player.component.css']
})
export class DeletePlayerComponent implements OnInit {

  @Input() player: Player | null = null;
  @Output() closeModal = new EventEmitter<boolean>();

  constructor(private playersApiService:PlayersApiService, private translateService:TranslateService,
    private router: Router, private alertService: AlertService
    ) { }
  action = this.translateService.instant('DELETE');


  ngOnInit(): void {
  }

  confirm(){
     this.playersApiService.deletePlayer(this.player?.id!)
        .subscribe({
          next: () => {
            this.alertService.toggleAlert('PLAYER_DELETED', AlertType.Info, '', 
            {firstName: this.player?.firstName, lastName: this.player?.lastName});

            this.router.navigate(['']);
            this.closeModal.emit(true);
          },
          error: (errorMessage:string) => {
            this.alertService.toggleAlert('ERROR_PLAYER_DELETE', AlertType.Danger, errorMessage,
            {firstName: this.player?.firstName, lastName: this.player?.lastName});
            // this.error = errorMessage;
          }
        });
  }

  close(){
    this.closeModal.emit();
  }

}
