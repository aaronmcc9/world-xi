import { Formation } from "../api/team/formation/formation.model";
import { Player } from "../players/player.model";

export class Team {

    constructor(public id: number, public teamName: string,
        public players: Player[], public formation: Formation) { }
}
