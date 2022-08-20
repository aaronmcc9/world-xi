import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Position } from "./player-position";

@Injectable({
    providedIn:'root'
})
export class PositionService{

    teamListPosition = new BehaviorSubject<string>('');
    positionList: string[] = [];

    //fetches string values of positions 
    fetchPositions(){

        this.positionList = <string[]>Object.values(Position)
        .filter(p => typeof p == typeof 'string');
        
        return this.positionList.slice(); 
    }
}