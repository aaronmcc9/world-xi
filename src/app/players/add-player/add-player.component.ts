import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { Position } from '../player-position';
import { Player } from '../player.model';
import { PlayersService } from '../players.service';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.css']
})
export class AddPlayerComponent implements OnInit {
  editMode = false;
  player: Player = <Player>{}
  positionTypes: string[] = []
  id: string = '';
  isLoading = false;
  error = '';
  form: FormGroup = new FormGroup({});


  constructor(private playerService: PlayersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      firstName: new FormControl<string>('', Validators.required),
      lastName: new FormControl<string>('', Validators.required),
      age: new FormControl<number>(16, [Validators.required, Validators.min(16)]),
      position: new FormControl<string>('', Validators.required),
      club: new FormControl<string>('', Validators.required),
      country: new FormControl<string>('', Validators.required),
      imagePath: new FormControl<string>('')
    });

    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    })

    this.positionTypes = <string[]>Object.values(Position)
      .filter(p => {
        return typeof p === 'string';
      })

    if (this.id) {
      this.editMode = true;

      if (this.playerService.players != null && this.playerService.players.length > 0) {

        const playerToEdit = this.playerService.players.find((player) => {
          return player.id === this.id;
        })

        if (playerToEdit) {
          this.player = playerToEdit;
          this.onSetForm();
        }
        else {
          this.onFetchPlayer(this.id);
        }
      }
      else {
        this.onFetchPlayer(this.id);
      }
    }

    else {
      this.editMode = false;
    }
  }

  onCreate() {
    this.isLoading = true;

    this.playerService.createPlayer(this.form.value)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.alertService.toggleAlert('ALERT_PLAYER_ADDED', AlertType.Success)
        },
        error: errorMessage => {
          // this.error = errorMessage;
          this.isLoading = false;

          this.alertService.toggleAlert('ALERT_PLAYER_ADD_FAILURE', AlertType.Danger, errorMessage)
        }
      })

    this.onClear();
  }

  onUpdate() {
    this.isLoading = true;

    this.playerService.updatePlayer({ ...this.form.value, id: this.player.id })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.alertService.toggleAlert('ALERT_PLAYER_UPDATED', AlertType.Success)
          this.router.navigate(['']);
        },
        error: (errorMessage: string) => {
          this.isLoading = false;
          this.alertService.toggleAlert('ALERT_PLAYER_UPDATE_FAILURE', AlertType.Danger, errorMessage)
          // this.error = errorMessage;
        }
      });
  }

  onClear() {
    this.form.reset();
  }

  onFetchPlayer(id: string) {
    this.isLoading = true;
    this.playerService.fetchPlayerById(id)
      .subscribe({
        next: res => {
          this.player = res;
          this.onSetForm();
          this.isLoading = false;
        },
        error: errorMessage => {
          this.isLoading = false;
          this.error = errorMessage;
        }
      });
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
}
