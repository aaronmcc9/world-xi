import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { ColumnService } from 'src/app/columns.service';
import { Position } from '../player-position';
import { Player } from '../player.model';
import { PlayersApiService } from '../../api/players/players-api.service';
import { ServiceResponse } from 'src/app/service-response.model';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-modify-player',
  templateUrl: './modify-player.component.html',
  styleUrls: ['./modify-player.component.css']
})
export class ModifyPlayerComponent implements OnInit {
  editMode = false;
  player: Player = <Player>{}
  positionTypes: string[] = [];
  positions = Object.values(Position)
    .filter(p => typeof p === 'number');

  id: number = 0;
  isLoading = false;
  error = '';
  form: FormGroup = new FormGroup({});
  cols: number = 2;

  constructor(private playersApiService: PlayersApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private columnService: ColumnService) { }

  async ngOnInit(): Promise<void> {

    this.columnService.columnObs?.subscribe((cols) => {
      this.cols = cols;
    })

    this.form = new FormGroup({
      firstName: new FormControl<string>('', Validators.required),
      lastName: new FormControl<string>('', Validators.required),
      age: new FormControl<number>(16, [Validators.required, Validators.min(16)]),
      position: new FormControl<Position>(Position.Goalkeeper, Validators.required),
      club: new FormControl<string>('', Validators.required),
      country: new FormControl<string>('', Validators.required),
      imagePath: new FormControl<string>('')
    });

    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    })

    this.positionTypes = Object.keys(Position)
      .filter(p => {
        return typeof p === 'string';
      })

    if (this.id) {
      this.editMode = true;

      if (this.playersApiService.players != null && this.playersApiService.players.length > 0) {

        await this.onFetchPlayer(this.id);
        //   const playerToEdit = this.playersApiService.players.find((player) => {
        //     return player.id === this.id;
        //   })

        //   if (playerToEdit) {
        //     this.player = playerToEdit;
        //     this.onSetForm();
        //   }
        //   else {
        //     this.onFetchPlayer(this.id);
        //   }
        // }
        // else {
        //   this.onFetchPlayer(this.id);
        // }
      }

      else {
        this.editMode = false;
      }
    }
  }

  async onSubmit() {
    if (!this.form.valid) {
      this.form.markAsDirty();
      return;
    }

    if (this.editMode)
      await this.onUpdate();
    else
      await this.onCreate()

    this.onClear();
  }

  async onCreate() {
    this.isLoading = true;

    try {
      let result = await lastValueFrom(this.playersApiService.createPlayer(this.form.value));
      this.isLoading = false;
      this.alertService.toggleAlert('ALERT_PLAYER_ADDED', AlertType.Success)

      if (result.data) {
        //latest fetch of players to notify existing sets
        this.playersApiService.playersChanged.next(result.data);
        this.router.navigate(['']);
      }
      else {
        this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYERS', AlertType.Danger, result.message)
      }
    }
    catch (e) {
      this.isLoading = false;
      this.alertService.toggleAlert('ALERT_PLAYER_ADD_FAILURE', AlertType.Danger)
    }

    // this.playersApiService.createPlayer(this.form.value)
    //   .subscribe({
    //     next: () => {
    //       this.isLoading = false;
    //       this.alertService.toggleAlert('ALERT_PLAYER_ADDED', AlertType.Success)
    //     },
    //     error: errorMessage => {
    //       console.log(errorMessage);
    //       this.isLoading = false;
    //       this.alertService.toggleAlert('ALERT_PLAYER_ADD_FAILURE', AlertType.Danger, errorMessage)
    //     }
    //   })
  }

  async onUpdate() {
    this.isLoading = true;

    try{
      const result = await lastValueFrom(this.playersApiService.updatePlayer({...this.form.value, id: this.player.id}));
      this.isLoading = false;
      this.alertService.toggleAlert('ALERT_PLAYER_UPDATED', AlertType.Success)

      if (result.data) {
        //latest fetch of players to notify existing sets
        this.playersApiService.playersChanged.next(result.data);
        this.router.navigate(['']);
      }
      else {
        this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYERS', AlertType.Danger, result.message)
      }
    }
    catch(e){
      this.isLoading = false;
      this.alertService.toggleAlert('ALERT_PLAYER_UPDATE_FAILURE', AlertType.Danger)
    }

    // this.playersApiService.updatePlayer({ ...this.form.value, id: this.player.id })
    //   .subscribe({
    //     next: () => {
    //       this.isLoading = false;
    //       this.alertService.toggleAlert('ALERT_PLAYER_UPDATED', AlertType.Success)
    //       this.router.navigate(['']);
    //     },
    //     error: (errorMessage: string) => {
    //       this.isLoading = false;
    //       this.alertService.toggleAlert('ALERT_PLAYER_UPDATE_FAILURE', AlertType.Danger, errorMessage)
    //       // this.error = errorMessage;
    //     }
    //   });
  }

  onClear() {
    this.form.reset();
  }

  async onFetchPlayer(id: number) {
    this.isLoading = true;
    try {
      const result = await lastValueFrom(this.playersApiService.fetchPlayerById(id));
      this.isLoading = false;

      if (result.data) {
        this.player = result.data;
        this.onSetForm();
      } else {
        this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYER', AlertType.Warning, result.message)
      }
    }
    catch (e) {
      console.log(e);
      this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYER', AlertType.Danger)
      this.isLoading = false;
    }
  }

  onSetForm() {

    this.form.setValue({
      firstName: this.player ? this.player.firstName : '',
      lastName: this.player ? this.player.lastName : '',
      age: this.player ? this.player.age : 16,
      position: this.player ? this.player.position : Position.Goalkeeper,
      club: this.player ? this.player.club : '',
      country: this.player ? this.player.country : '',
      imagePath: this.player ? this.player.imagePath : ''
    });
  }

  getPosition(position: string | Position): string {
    return Position[+position];
  }
}
