import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { ColumnService } from 'src/app/columns.service';
import { Position } from '../player-position';
import { Player } from '../player.model';
import { PlayersApiService } from '../../api/players/players-api.service';
import { lastValueFrom } from 'rxjs';
import { PositionService } from '../position.service';

@Component({
  selector: 'app-modify-player',
  templateUrl: './modify-player.component.html',
  styleUrls: ['./modify-player.component.css']
})
export class ModifyPlayerComponent implements OnInit {
  editMode = false;
  player: Player | null = null;
  positions: Position[] = [];

  id: number = 0;
  isLoading = false;
  error = '';
  form: FormGroup = new FormGroup({});
  cols: number = 2;

  constructor(private playersApiService: PlayersApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private columnService: ColumnService,
    public positionService: PositionService) { }

  async ngOnInit(): Promise<void> {

    this.columnService.columnObs?.subscribe((cols) => {
      this.cols = cols;
    })

    this.positions = this.positionService.fetchPositionValues();

    this.form = new FormGroup({
      firstName: new FormControl<string>('', Validators.required),
      lastName: new FormControl<string>('', Validators.required),
      age: new FormControl<number>(16, [Validators.required, Validators.min(16)]),
      position: new FormControl<Position>(Position.Goalkeeper,
        [Validators.required, Validators.min(Math.min(...this.positions)), Validators.max(Math.max(...this.positions))]),
      club: new FormControl<string>('', Validators.required),
      country: new FormControl<string>('', Validators.required),
      imagePath: new FormControl<string>('')
    });

    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    })

    if (this.id) {
      this.editMode = true;

      const playerToEdit = this.playersApiService.players.find((player) => {
        return player.id === this.id;
      })

      this.player = playerToEdit ?? await this.onFetchPlayer(this.id);

      this.onSetForm();
    }
    else {
      this.editMode = false;
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
        this.onClear();
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
  }

  async onUpdate() {
    console.log(this.form.value);
    if (!this.player) {
      this.alertService.toggleAlert('ALERT_PLAYER_NOT_FOUND', AlertType.Danger);
      throw Error("Invalid Operation");
    }

    this.isLoading = true;

    try {
      const result = await lastValueFrom(this.playersApiService.updatePlayer({ ...this.form.value, id: this.player.id }));
      this.isLoading = false;
      this.alertService.toggleAlert('ALERT_PLAYER_UPDATED', AlertType.Success)

      if (result.data) {
        //latest fetch of players to notify existing sets
        this.playersApiService.playersChanged.next(result.data);
        this.onClear();
        this.router.navigate(['']);
      }
      else {
        this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYERS', AlertType.Warning, result.message)
      }
    }
    catch (e) {
      this.isLoading = false;
      this.alertService.toggleAlert('ALERT_PLAYER_UPDATE_FAILURE', AlertType.Danger)
    }
  }

  onClear() {
    this.form.reset();
  }

  async onFetchPlayer(id: number): Promise<Player | null> {
    this.isLoading = true;
    try {
      const result = await lastValueFrom(this.playersApiService.fetchPlayerById(id));
      this.isLoading = false;

      if (result.data) {
        return result.data;
      } else {
        this.alertService.toggleAlert('ALERT_PLAYER_NOT_FOUND', AlertType.Warning, result.message)
      }
    }
    catch (e) {
      console.log(e);
      this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYER', AlertType.Danger)
      this.isLoading = false;
    }

    return null;
  }

  onSetForm() {
    if (!this.player)
      return;

    this.form.setValue({
      firstName: this.player.firstName,
      lastName: this.player.lastName,
      age: this.player.age,
      position: this.player.position,
      club: this.player.club,
      country: this.player.country,
      imagePath: this.player.imagePath
    });
  }
}
