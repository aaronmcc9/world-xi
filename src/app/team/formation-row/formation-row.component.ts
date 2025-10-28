import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlayerDto } from 'src/app/players/player.dto';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-formation-row',
  templateUrl: './formation-row.component.html',
  styleUrls: ['./formation-row.component.css']
})
export class FormationRowComponent implements OnInit, OnDestroy{

  @Input('players') players: (PlayerDto|undefined)[] = [];
  playerToModify: PlayerDto | null = null;
  playerToModifySubscription = new Subscription();
  
  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    this.playerToModifySubscription = this.teamService.playerToModify.subscribe((player: PlayerDto | null) => {
      this.playerToModify = player;
    });
  }

  ngOnDestroy(): void {
    this.playerToModifySubscription.unsubscribe();
  }

  removePlayer(player: PlayerDto) {
    //only can modify one player at a time
    if(!this.playerToModify)
      this.teamService.playerToModify.next(player);
  }
}
