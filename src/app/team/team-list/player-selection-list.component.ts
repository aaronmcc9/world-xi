import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { cloneDeep, isNull } from 'lodash';
import { Position } from 'src/app/players/player-position';
import { PositionService } from 'src/app/players/position.service';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { PlayerPageTotals } from './players-in-position/players-in-position.component';

@Component({
  selector: 'app-team-list',
  templateUrl: './player-selection-list.component.html',
  styleUrls: ['./player-selection-list.component.css']
})
export class PlayerSelectionListComponent implements OnInit, OnDestroy {
  positions: Position[] = [];
  listPositions: Position[] = [];

  pageSize = 4;
  page = 1;
  skip = 0;
  take = 4;
  totalPlayers = 0;
  itemsViewingCount = 0;
  canPageRight = false;
  pageBack = false;

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
    this.pageSize = !position ?
      4 : 16;

    //reset pages with each filter
    this.skip = 0;
    this.take = this.pageSize;
    this.page = 1;
    this.totalPlayers = 0;
    this.itemsViewingCount = 0;

    this.listPositions = position ?
      cloneDeep(this.positions.filter((p: Position) => p == +position)) :
      cloneDeep(this.positions);
  }

  //ERROR WITH MINUS - MUST FIX
  setCanPageRight(playerTotals: PlayerPageTotals) {

    //counts total players from each position segment
    this.totalPlayers = this.totalPlayers + playerTotals['total'];
    this.itemsViewingCount =  this.pageBack ? 
      this.itemsViewingCount - playerTotals['totalOnPage'] :
      this.itemsViewingCount + playerTotals['totalOnPage'];

      console.log(this.skip, this.take);
    
    this.canPageRight = this.totalPlayers > this.itemsViewingCount;
  }

  async onPageChanged(page: number) {
    this.pageBack = page < this.page

    this.page = page;
    this.totalPlayers = 0;
    this.take = this.pageSize * page;
    this.skip = this.take - this.pageSize
  }

  ngOnDestroy(): void {
  }
}
