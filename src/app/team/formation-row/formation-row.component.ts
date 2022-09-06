import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Player } from 'src/app/players/player.model';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-formation-row',
  templateUrl: './formation-row.component.html',
  styleUrls: ['./formation-row.component.css']
})
export class FormationRowComponent implements OnInit {

  //the number of selections available for the position - e.g 3 midfielders
  @Input('playerCount') playerCount: number = 1;
  player: Player | null= null;
  
  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    
  }

  modifyPlayer() {
    this.teamService.playerToModify.next(this.player);
  }
}