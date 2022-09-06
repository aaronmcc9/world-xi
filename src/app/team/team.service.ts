import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Player } from "../players/player.model";
import { PlayersService } from "../players/players.service";

@Injectable({
  providedIn: "root"
})
export class TeamService {

  page = new BehaviorSubject<number>(1);
  playerToModify = new BehaviorSubject<Player | null>(null);

}