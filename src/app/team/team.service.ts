import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Subject, tap, throwError } from "rxjs";
import { AuthService } from "../auth/auth/auth.service";
import { Position } from "../players/player-position";
import { Player } from "../players/player.model";

@Injectable({
  providedIn: "root"
})
export class TeamService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  page = new BehaviorSubject<number>(1);
  playerToModify = new BehaviorSubject<Player | null>(null);

  teamGoalkeeper = new BehaviorSubject<Player[]>(new Array<Player>(1));
  teamDefence = new BehaviorSubject<(Player | undefined)[]>(new Array<Player>(4));
  teamMidfield = new BehaviorSubject<(Player | undefined)[]>(new Array<Player>(4));
  teamForward = new BehaviorSubject<(Player | undefined)[]>(new Array<Player>(2));


  saveUserTeam(team: Player[]) {

    let userId = this.authService.getCurrentUserId();

    if (userId == undefined)
      throwError("User is logged out. Please logout to peform this operation")

    return this.http.put('https://world-xi-app-default-rtdb.firebaseio.com/teams/' + userId + '.json', team)
      .pipe(catchError((error) => throwError(error)));
  }

  fetchUserTeam() {
    let userId = this.authService.getCurrentUserId();

    return this.http.get<{ [key: string]: Player }>('https://world-xi-app-default-rtdb.firebaseio.com/teams/' + userId + '.json')
      .pipe(catchError((error) => throwError(error)),
        tap((res: { [key: string]: Player }) => {
          if (res) {
            let players =  Object.values(res);
            if (players && players.length != 10) {

              let goalkeeper = players.filter((player) => player.position === Position[Position.Goalkeeper])
              let defence = players.filter((player) => player.position === Position[Position.Defender])
              let midfield = players.filter((player) => player.position === Position[Position.Midfield])
              let forward = players.filter((player) => player.position === Position[Position.Forward])
              this.setPlayersInPosition(goalkeeper, defence, midfield, forward);
            }
          }
          else {
            this.setPlayersInPosition(new Array<Player>(1), new Array<Player>(4), new Array<Player>(4), new Array<Player>(2));
          }
        }));
  }

  private setPlayersInPosition(goalkeeper: Player[], defence: Player[], midfield: Player[],
    forwards: Player[]) {
    this.teamGoalkeeper.next(goalkeeper);
    this.teamDefence.next(defence);
    this.teamMidfield.next(midfield);
    this.teamForward.next(forwards);
  }

}