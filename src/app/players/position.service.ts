import { Injectable } from "@angular/core";
import { isNumber } from "lodash";
import { BehaviorSubject, Subject } from "rxjs";
import { Position } from "./player-position";

@Injectable({
    providedIn: 'root'
})
export class PositionService {

    teamListPosition = new BehaviorSubject<Position | null>(null);
    positionValues: number[] = [];

    //fetches string values of positions 
    fetchPositionsNames(): string[] {

        let positionNames = <string[]>Object.values(Position)
            .filter(p => typeof p == typeof 'string');

        return positionNames.slice();
    }

    fetchPositionValues(): Position[] {

        this.positionValues = <Position[]>Object.values(Position)
            .filter((p) => isNumber(p));

        console.log(this.positionValues);

        return this.positionValues.slice();
    }

    getPositionName(position: Position): string {
        return Position[position];
    }
}