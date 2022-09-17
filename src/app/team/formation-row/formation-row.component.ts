import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Player } from 'src/app/players/player.model';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-formation-row',
  templateUrl: './formation-row.component.html',
  styleUrls: ['./formation-row.component.css']
})
export class FormationRowComponent implements OnInit {

  @Input('players') players: Player[] = [];
  
  constructor(private teamService: TeamService) { }


  ngOnInit(): void {
  }

  removePlayer(player: Player) {
    this.teamService.playerToModify.next(player);
  }
}
