import { Injectable } from "@angular/core";
import { BehaviorSubject, lastValueFrom } from "rxjs";
import { Position } from "../players/player-position";
import { PlayerDto } from "../players/player.dto";
import { Team } from "./team.model";
import { __ } from "lodash";
import { AlertService } from "../alert/alert.service";
import { AlertType } from "../alert/alert-type.enum";
import { Formation } from "../api/team/formation/formation.model";
import { FormationApiService } from "../api/team/formation/formation-api.service";
import { User } from "../api/User/user.dto";

@Injectable({
  providedIn: "root"
})
export class TeamService {

  constructor(private alertService: AlertService,
    private formationApiService: FormationApiService) { }

  playerToModify = new BehaviorSubject<PlayerDto | null>(null);

  teamGoalkeeper = new BehaviorSubject<(PlayerDto | undefined)[]>(new Array<PlayerDto>(1));
  teamDefence = new BehaviorSubject<(PlayerDto | undefined)[]>(new Array<PlayerDto>(4));
  teamMidfield = new BehaviorSubject<(PlayerDto | undefined)[]>(new Array<PlayerDto>(4));
  teamForward = new BehaviorSubject<(PlayerDto | undefined)[]>(new Array<PlayerDto>(2));

  emptyUser:User = {
    id: 0,
    username: "",
    email: "",
    notifications:[],
    friends:[]
  }

  savedTeam = new BehaviorSubject<Team | null>(null);
  canCancelChanges = false;
  formations: Formation[] = [];

  async fetchFormationList(): Promise<Formation[]> {
    try {
      const result = await lastValueFrom(this.formationApiService.fetchAllFormations());

      if (result.success) {  
        this.formations = result.data;
        return this.formations.slice();
      }
      else{
        this.alertService.toggleAlert("", AlertType.Danger, result.message);
      }
    }

    catch (e) {
      this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_FORMATIONS', AlertType.Danger);
    }

    return [];
  }


  /**
   * 
   * @param players 
   * Sorts players by position before pushing the results to the relevant subscribers
   */
  setPlayersByPosition(players: PlayerDto[]) {
    let goalkeeper = players.filter((player) => player.position === Position.Goalkeeper);
    let defence = players.filter((player) => player.position === Position.Defender);
    let midfield = players.filter((player) => player.position === Position.Midfield);
    let forward = players.filter((player) => player.position === Position.Forward);
    this.setPlayersInPosition(goalkeeper, defence, midfield, forward);
  }

  setPlayersInPosition(goalkeeper: PlayerDto[], defence: PlayerDto[], midfield: PlayerDto[],
    forwards: PlayerDto[]) {
    this.teamGoalkeeper.next(goalkeeper);
    this.teamDefence.next(defence);
    this.teamMidfield.next(midfield);
    this.teamForward.next(forwards);

    this.canCancelChanges = false;
  }

  getDefaultFormation(): Formation {
    return this.formations.find((f: Formation) => f.structure == "442")!;
  }
}