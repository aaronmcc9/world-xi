import { Component, OnDestroy, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Position } from 'src/app/players/player-position';
import { PositionService } from 'src/app/players/position.service';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { PlayerPageTotals } from './players-in-position/players-in-position.component';


class ViewCountNode {
    value: number;
    next: ViewCountNode | null;
    prev: ViewCountNode | null;

    constructor(value: number, next: ViewCountNode | null = null, prev: ViewCountNode | null = null) {
        this.value = value;
        this.next = next;
        this.prev = prev;
    }
}

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
    itemsViewingCount = new ViewCountNode(0);
    canPageRight = false;
    isNewNode = true;

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
        this.itemsViewingCount = new ViewCountNode(0);
        this.isNewNode = true;

        this.listPositions = position ?
            cloneDeep(this.positions.filter((p: Position) => p == +position)) :
            cloneDeep(this.positions);
    }

    //ERROR WITH MINUS - MUST FIX
    setCanPageRight(playerTotals: PlayerPageTotals) {
        //counts total players from each position segment
        //only need to calculate once (total players overall)
        // if prev and next is null, this is the first time we are calculating totals
        if (this.itemsViewingCount.prev === null && this.itemsViewingCount.next === null)
            this.totalPlayers += playerTotals['total'];

        // if there is no next, this must be the first time we are calculating viewing count for this page
        if (this.isNewNode) {
            this.itemsViewingCount.value += playerTotals['totalOnPage'];
        }

        //if the viewing count is less than total players, can page right
        this.canPageRight = this.totalPlayers > this.itemsViewingCount.value;
    }

    async onPageChanged(page: number) {
        let newNode = false;
        if (page < this.page) {
            this.itemsViewingCount = this.itemsViewingCount.prev!;
        }
        else if (this.itemsViewingCount.next === null) {
            this.itemsViewingCount.next = new ViewCountNode(this.itemsViewingCount.value, null, this.itemsViewingCount);
            this.itemsViewingCount = this.itemsViewingCount.next;
            newNode = true;
        }
        else
            this.itemsViewingCount = this.itemsViewingCount.next;

        this.isNewNode = newNode;
        this.page = page;
        this.take = this.pageSize * page;
        this.skip = this.take - this.pageSize
    }

    ngOnDestroy(): void {
    }
}
