import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { from, fromEventPattern } from 'rxjs';
import { PlayersService } from '../players.service';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.css']
})
export class AddPlayerComponent implements OnInit {
  isLoading = false;
  error = null;

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    age: new FormControl(16, [Validators.required, Validators.min(16)]),
    position: new FormControl('', Validators.required),
    club: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    imagePath: new FormControl('')
  });

  constructor(private playerService: PlayersService) { }

  ngOnInit(): void {
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

  onClear() {
    this.form.reset();
  }
}
