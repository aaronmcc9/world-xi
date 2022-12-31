import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Position } from "./player-position";
import { Player } from "./player.model";

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    players = new BehaviorSubject<Player[]>([]);

    getPlayerCountByPosition(position: Position) {
        return this.players.getValue().filter((player: Player) => {
            return player.position === position;
        }).length;
    }
}