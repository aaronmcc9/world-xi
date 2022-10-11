import { Player } from "../players/player.model";

export class Team {

    constructor(private players: Player[], private formation: string) { }
}
