import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { Position } from 'src/app/players/player-position';
import { PositionService } from 'src/app/players/position.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit, OnDestroy{
  positions: string[] = [];

  @Input('playerFilter') playerFilter = 'All';
  @Input('page') page = 1;

  positionSubscription = new Subscription();

  constructor(private positionService: PositionService) { }
  
  ngOnInit(): void {

    //get an array of all positions
    this.positions = this.positionService.fetchPositions();

    this.positionSubscription = this.positionService.teamListPosition
      .subscribe((filterString) => {

        this.positions = this.positionService.positionList
          .filter((p) => {

            if (filterString == '')
              return p;

            return p === filterString;
          });
      });
  }

  ngOnDestroy(): void {
    this.positionSubscription.unsubscribe()
  }
}
