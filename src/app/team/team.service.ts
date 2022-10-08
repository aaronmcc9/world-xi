import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Subject, throwError } from "rxjs";
import { AuthService } from "../auth/auth/auth.service";
import { Player } from "../players/player.model";
import { PlayersService } from "../players/players.service";

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



  createUserTeam(team: Player[]) {

    let userId = this.authService.getCurrentUserId();

    if (userId == undefined)
      throwError("User is logged out. Please logout to peform this operation")

    return this.http.post('https://world-xi-app-default-rtdb.firebaseio.com/users/' + userId + '/team.json', team)
      .pipe(catchError((error) => throwError(error)));
  }

  updateUserTeam(team: Player[] | undefined) {
    let userId = this.authService.getCurrentUserId();

    return this.http.put('https://world-xi-app-default-rtdb.firebaseio.com/users/' + userId + '/team.json', team)
      .pipe(catchError((error) => throwError(error)));
  }

  fetchUserTeam() {
    let userId = this.authService.getCurrentUserId();

    return this.http.get('https://world-xi-app-default-rtdb.firebaseio.com/users/' + userId + '/team.json')
      .pipe(catchError((error) => throwError(error)));
  }
}