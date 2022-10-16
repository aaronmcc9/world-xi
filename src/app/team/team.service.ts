import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Subject, tap, throwError } from "rxjs";
import { AuthService } from "../auth/auth/auth.service";
import { Position } from "../players/player-position";
import { Player } from "../players/player.model";
import { Team } from "./team.model";
import {__, cloneDeep } from "lodash";

@Injectable({
  providedIn: "root"
})
export class TeamService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  page = new BehaviorSubject<number>(1);
  playerToModify = new BehaviorSubject<Player | null>(null);

  teamGoalkeeper = new BehaviorSubject<(Player | undefined)[]>(new Array<Player>(1));
  teamDefence = new BehaviorSubject<(Player | undefined)[]>(new Array<Player>(4));
  teamMidfield = new BehaviorSubject<(Player | undefined)[]>(new Array<Player>(4));
  teamForward = new BehaviorSubject<(Player | undefined)[]>(new Array<Player>(2));

  savedTeam = new Team([], '');

  /**
   * 
   * @param team includes selected players and set formation
   * @returns Saves team for specific user and returns errors if any
   */
  saveUserTeam(team: Team) {

    let userId = this.authService.getCurrentUserId();

    if (userId == undefined)
      throwError("User is logged out. Please logout to peform this operation")

    return this.http.put<Team>('https://world-xi-app-default-rtdb.firebaseio.com/teams/' + userId + '.json', team)
      .pipe(catchError((error) => throwError(error)),
      tap((res) => {this.savedTeam = this.savedTeam = cloneDeep(res);
      }));
  }


  /**
 * 
 * @returns The users saved team should the have one
 */
  fetchUserTeam() {
    let userId = this.authService.getCurrentUserId();

    return this.http.get<Team>('https://world-xi-app-default-rtdb.firebaseio.com/teams/' + userId + '.json')
      .pipe(catchError((error) => throwError(error)),
        tap((res: Team) => {
          if (res) {
            let players = <Player[]>Object.values(res['players']);

            if (players && players.length === 11) {
              //to keep record before user makes changes
              this.savedTeam = cloneDeep(res);
              this.setPlayersByPosition(players);
            }
          }
          else {
            this.setPlayersInPosition(new Array<Player>(1), new Array<Player>(4), new Array<Player>(4), new Array<Player>(2));
          }
        }));
  }

  /**
   * 
   * @param players 
   * Sorts players by position before pushing the results to the relevant subscribers
   */
  setPlayersByPosition(players: Player[]) {
    let goalkeeper = players.filter((player) => player.position === Position[Position.Goalkeeper]);
    let defence = players.filter((player) => player.position === Position[Position.Defender]);
    let midfield = players.filter((player) => player.position === Position[Position.Midfield]);
    let forward = players.filter((player) => player.position === Position[Position.Forward]);
    this.setPlayersInPosition(goalkeeper, defence, midfield, forward);
  }

  private setSelectionStatus(){

  }

  private setPlayersInPosition(goalkeeper: Player[], defence: Player[], midfield: Player[],
    forwards: Player[]) {
    this.teamGoalkeeper.next(goalkeeper);
    this.teamDefence.next(defence);
    this.teamMidfield.next(midfield);
    this.teamForward.next(forwards);
  }
}