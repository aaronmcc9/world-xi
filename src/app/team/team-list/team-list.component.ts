import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { isNull } from 'lodash';
import { filter, Subscription } from 'rxjs';
import { Position } from 'src/app/players/player-position';
import { PositionService } from 'src/app/players/position.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit, OnDestroy{
  positions: Position[] = [];
  positionSubscription = new Subscription();

  constructor(public positionService: PositionService) { }
  
  ngOnInit(): void {

    //get an array of all positions
    this.positions = this.positionService.fetchPositionValues();

    this.positionSubscription = this.positionService.teamListPosition
      .subscribe((position) => {

        this.positions = this.positionService.positionValues;

        if(position)
          this.positions = this.positions.filter((p:Position) => p == position);
      });
  }

  ngOnDestroy(): void {
    this.positionSubscription.unsubscribe()
  }
}
