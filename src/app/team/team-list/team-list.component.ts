import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { filter } from 'rxjs';
import { Position } from 'src/app/players/player-position';
import { PositionService } from 'src/app/players/position.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  positions: string[] = [];

  @Input('playerFilter') playerFilter = 'All';

  constructor(private positionService: PositionService) { }

  ngOnInit(): void {

    //get an array of all positions
    this.positions = this.positionService.fetchPositions();

    this.positionService.teamListPosition
      .subscribe((filterString) => {

        this.positions = this.positionService.positionList
          .filter((p) => {

            if (filterString == '')
              return p;

            return p === filterString;
          });
      });
  }
}
