import { Component, Input, OnInit } from '@angular/core';
import { Position } from 'src/app/players/player-position';
import { Player } from 'src/app/players/player.model';
import { PlayersService } from 'src/app/players/players.service';
import { faUpRightFromSquare} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-players-in-position',
  templateUrl: './players-in-position.component.html',
  styleUrls: ['./players-in-position.component.css']
})
export class PlayersInPositionComponent implements OnInit {
  @Input('position') position: number = 0;
  players: Player[] = [];
  error = '';
  loading = false;

  //icons
  selectIcon = faUpRightFromSquare




  constructor(private playersService: PlayersService) { }

  ngOnInit(): void {

    this.players = this.playersService.players
      .filter(p => {
        return p.position == Position[this.position];
      });

      console.log("this.players", this.players)


    if (this.players === null || this.players.length === 0)
      this.fetchPlayers();
  }

  fetchPlayers() {
    this.loading = true;

    this.playersService.fetchAllPlayers()
      .subscribe({
        next: players => {

          this.players = players.filter(p => {
            return p.position == Position[this.position];
          });

          this.loading = false;

        },
        error: message => {
          this.error = message;
          this.loading = false;
        }
      });
  }

}
