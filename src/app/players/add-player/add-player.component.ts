import { Component, OnInit } from '@angular/core';
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
  error = null;
  form: FormGroup = new FormGroup({});


  constructor(private playerService: PlayersService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    })

    if (this.id) {
      this.editMode = true;

      if (this.playerService.players != null && this.playerService.players.length > 0) {
        const playerToEdit = this.playerService.players.find((player) => {
          return player.id === this.id;
        })

        playerToEdit ? this.player = playerToEdit :
          this.onFetchPlayer(this.id);
      }
      else {
        this.onFetchPlayer(this.id);
      }
    }

    else {
      this.editMode = false;
    }

    console.log("ger", this.player);
    this.form = new FormGroup({
      firstName: new FormControl(this.player ? this.player.firstName : '', Validators.required),
      lastName: new FormControl(this.player ? this.player.lastName : '', Validators.required),
      age: new FormControl(this.player ? this.player.age : 16, [Validators.required, Validators.min(16)]),
      position: new FormControl(this.player ? this.player.position : '', Validators.required),
      club: new FormControl(this.player ? this.player.club : '', Validators.required),
      country: new FormControl(this.player ? this.player.country : '', Validators.required),
      imagePath: new FormControl(this.player ? this.player.imagePath : '')
    });

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

  onUpdate(){
    this.isLoading = true;

    this.playerService.updatePlayer(this.form.value)
      .subscribe({
        next: ( )=>{
          this.isLoading = false;
          this.router.navigate(['']);
        },
        error: errorMessage => {
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
          console.log(res);
          this.player = res;
        },
        error: errorMessage => {
          this.isLoading = false;
          this.error = errorMessage;
        }
      });
  }
}
