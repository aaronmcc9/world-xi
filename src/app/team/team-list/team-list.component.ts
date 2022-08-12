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

        console.log("WORKING", filterString);
        this.positions = this.positionService.positionList
          .filter((p) => {

            if (filterString == '')
              return p;

              console.log("p == filterString", p == filterString)
            return p === filterString;
          });

        console.log("not WORKING", this.positions);
        console.log("Mere", this.positionService.positionList);


      })
  }
}
