import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { cloneDeep, isNull } from 'lodash';
import { filter, Subscription } from 'rxjs';
import { Position } from 'src/app/players/player-position';
import { PositionService } from 'src/app/players/position.service';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit, OnDestroy {
  positions: Position[] = [];
  listPositions: Position[] = [];

  pageSize = 4;
  page = 1;
  skip = 0;
  take = 4;
  total = 0;
  canPageRight = false;

  //icons
  leftNav = faArrowLeft;
  rightNav = faArrowRight;

  constructor(public positionService: PositionService) { }

  ngOnInit(): void {

    //get an array of all positions  - doesnt change
    this.positions = this.positionService.fetchPositionValues();

    //changes with filter
    this.listPositions = this.positions;
  }


  onFilterPlayerList(position: string) {
    console.log(position, this.positions);
    this.pageSize = !position ?
      4 : 16;

    //reset pages with each filter
    this.skip = 0;
    this.take = this.pageSize;
    this.total = 0;

    this.listPositions = position ?
      cloneDeep(this.positions.filter((p: Position) => p == +position)) :
      cloneDeep(this.positions);
  }

  setPageRight(playerTotal: number) {
    this.total = this.total + playerTotal

    this.canPageRight = this.pageSize == 16 ?
      this.total > this.take :
      this.total > this.take * this.pageSize;
  }

  onPageLeft() {
    if (this.page > 1) {
      console.log(this.skip, this.take)
      this.total = 0;
      this.skip = this.skip - this.pageSize;
      this.take = this.take - this.pageSize;
      this.page--;
    }
  }

  onPageRight() {
    this.total = 0;
    this.skip = this.skip + this.pageSize;
    this.page++;
    this.take = this.pageSize * this.page;
  }

  ngOnDestroy(): void {
  }
}
