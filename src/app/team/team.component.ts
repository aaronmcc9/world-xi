import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PositionService } from '../players/position.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  form = new FormGroup({});
  formationsList: string[] = [];
  positions: string[] = [];

  //formation values
  defenceCount: number = 4;
  midfieldCount: number = 4;
  forwardCount: number = 2;

  playerPositionFilter = '';


  constructor(private positionService: PositionService) { }

  ngOnInit(): void {

    this.formationsList = ['343', '352', '342', '442', '433', '451', '532', '541', '523']
    this.positions = this.positionService.fetchPositions();

    this.form = new FormGroup({
      formation: new FormControl('442', Validators.required)
    });

  }

  onFormationChange() {
    let formation = this.form.controls['formation'].value;

    if (formation != null && formation.length === 3) {
      this.defenceCount = +formation[0];
      this.midfieldCount = +formation[1];
      this.forwardCount = +formation[2];
    }
  }

  onFilterPlayerList(value: string) {
    this.positionService.teamListPosition.next(value);
    // this.playerPositionFilter = value;
  }

}
