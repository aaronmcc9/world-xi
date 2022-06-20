import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  id: string = '';
  isLoading = false;
  error = '';
  form: FormGroup = new FormGroup({});


  constructor(private playerService: PlayersService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      age: new FormControl(16, [Validators.required, Validators.min(16)]),
      position: new FormControl('', Validators.required),
      club: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      imagePath: new FormControl('')
    });

    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    })

    if (this.id) {
      this.editMode = true;

      if (this.playerService.players != null && this.playerService.players.length > 0) {

        const playerToEdit = this.playerService.players.find((player) => {
          return player.id === this.id;
        })

        console.log(playerToEdit);

        if(playerToEdit){
          this.player = playerToEdit;
          this.onSetForm();
        } 
        else{
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
        next: responseData => {
          this.isLoading = false;
        },
        error: errorMessage => {
          this.error = errorMessage;
          this.isLoading = false;
        }
      })

    this.onClear();
  }

  onUpdate() {
    this.isLoading = true;

    this.playerService.updatePlayer({ ...this.form.value, id: this.player.id })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigate(['']);
        },
        error: (errorMessage: string) => {
          this.isLoading = false;
          this.error = errorMessage;
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
        },
        error: errorMessage => {
          this.isLoading = false;
          this.error = errorMessage;
        }
      });
  }

  onSetForm() {
    console.log("nd", this.player);
    this.form.setValue({
      firstName: this.player ? this.player.firstName : '',
      lastName: this.player ? this.player.lastName : '',
      age: this.player ? this.player.age : 16,
      position: this.player ? this.player.position : '',
      club: this.player ? this.player.club : '',
      country: this.player ? this.player.country : '',
      imagePath: this.player ? this.player.imagePath : ''
    });
  }
}
