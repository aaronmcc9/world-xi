import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Position } from "./player-position";
import { PlayerDto } from "./player.dto";

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    players = new BehaviorSubject<PlayerDto[]>([]);

    getPlayerCountByPosition(position: Position) {
        return this.players.getValue().filter((player: PlayerDto) => {
            return player.position === position;
        }).length;
    }
}