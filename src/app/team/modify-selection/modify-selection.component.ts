import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Player } from 'src/app/players/player.model';
import { SelectionAction } from '../selection-action';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-modify-selection',
  templateUrl: './modify-selection.component.html',
  styleUrls: ['./modify-selection.component.css']
})
export class ModifySelectionComponent implements OnInit {

  player: Player | null = null;
  action: string = '';

  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    this.player = this.teamService.playerToModify.getValue();
    this.action = this.player?.isSelected ? SelectionAction[SelectionAction.Remove]
      : SelectionAction[SelectionAction.Select];
  }

  cancel() {
    this.teamService.playerToModify.next(null);
  }

  
  submit() {
    if (this.player) {
      this.player.isSelected = !this.player.isSelected;
    }
  }

}
