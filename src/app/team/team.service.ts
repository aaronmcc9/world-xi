import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Subject, tap, throwError } from "rxjs";
import { AuthService } from "../auth/auth/auth.service";
import { Position } from "../players/player-position";
import { Player } from "../players/player.model";
import { Team } from "./team.model";
import { __, cloneDeep } from "lodash";
import { AlertService } from "../alert/alert.service";
import { AlertType } from "../alert/alert-type.enum";
import { ServiceResponse } from "../service-response.model";

@Injectable({
  providedIn: "root"
})
export class TeamService {

  private readonly url = "https://localhost:7258/api/team/"


  constructor(private http: HttpClient, private authService: AuthService,
    private alertService: AlertService) { }

  page = new BehaviorSubject<number>(1);
  playerToModify = new BehaviorSubject<Player | null>(null);

  teamGoalkeeper = new BehaviorSubject<(Player | undefined)[]>(new Array<Player>(1));
  teamDefence = new BehaviorSubject<(Player | undefined)[]>(new Array<Player>(4));
  teamMidfield = new BehaviorSubject<(Player | undefined)[]>(new Array<Player>(4));
  teamForward = new BehaviorSubject<(Player | undefined)[]>(new Array<Player>(2));

  savedTeam = new Team(0, '', [], '442');
  canCancelChanges = false;

  /**
   * 
   * @param team includes selected players and set formation
   * @returns Saves team for specific user and returns errors if any
   */
  async createTeam(team: Team) {
    return this.http.post<ServiceResponse<Team>>(this.url, team)
      .pipe(catchError(((errorRes: ServiceResponse<Team>) => throwError(errorRes))),
        tap((res: ServiceResponse<Team>) => {
          this.savedTeam = this.savedTeam = cloneDeep(res.data);
          this.canCancelChanges = false;
        }));
  }

  /**
   * 
   * @param team includes selected players and set formation
   * @returns Saves team for specific user and returns errors if any
   */
  updateTeam(team: Team) {

    return this.http.put<ServiceResponse<Team>>(this.url, team)
      .pipe(catchError((errorRes: ServiceResponse<Team>) => throwError(errorRes)),
        tap((res: ServiceResponse<Team>) => {
          this.savedTeam = cloneDeep(res.data);
          this.canCancelChanges = false;
        }));
  }



  /**
 * 
 * @returns The users saved team should the have one
 */
  fetchUserTeam() {

    return this.http.get<ServiceResponse<Team>>(this.url)
      .pipe(catchError((errorRes: ServiceResponse<Team>) => throwError(errorRes.message)),
        tap((res: ServiceResponse<Team>) => {
          console.log(res.data);
          //to keep record before user makes changes
          // this.savedTeam = cloneDeep(res.data);
          this.setPlayersByPosition(res.data.players);
        }
        ));
  }

  /**
  * 
  * @returns The users saved team should the have one
  */
  deleteTeam() {
    this.http.delete(this.url)
      .subscribe({
        next: () => {
          let formation = this.savedTeam['formation'];

          formation ?
            this.setPlayersInPosition(new Array<Player>(1), new Array<Player>(+formation[0]), new Array<Player>(+formation[1]), new Array<Player>(+formation[2])) :
            this.setPlayersInPosition(new Array<Player>(1), new Array<Player>(4), new Array<Player>(4), new Array<Player>(2));

          this.alertService.toggleAlert('ALERT_TEAM_DELETE_SUCCESS', AlertType.Success);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.toggleAlert('ALERT_TEAM_DELETE_FAILURE', AlertType.Danger, error.message);
        }
      });
  }

  /**
   * 
   * @param players 
   * Sorts players by position before pushing the results to the relevant subscribers
   */
  setPlayersByPosition(players: Player[]) {
    let goalkeeper = players.filter((player) => player.position === Position.Goalkeeper);
    let defence = players.filter((player) => player.position === Position.Defender);
    let midfield = players.filter((player) => player.position === Position.Midfield);
    let forward = players.filter((player) => player.position === Position.Forward);
    this.setPlayersInPosition(goalkeeper, defence, midfield, forward);
  }

  setPlayersInPosition(goalkeeper: Player[], defence: Player[], midfield: Player[],
    forwards: Player[]) {
    this.teamGoalkeeper.next(goalkeeper);
    this.teamDefence.next(defence);
    this.teamMidfield.next(midfield);
    this.teamForward.next(forwards);

    this.canCancelChanges = false;
  }



  //  saveUserTeam(team: Team) {

  //   let userId = this.authService.getCurrentUserId();

  //   if (userId == undefined)
  //     throwError("User is login out. Please logout to peform this operation")

  //   return this.http.put<Team>('https://world-xi-app-default-rtdb.firebaseio.com/teams/' + userId + '.json', team)
  //     .pipe(catchError((error) => throwError(error)),
  //       tap((res) => {
  //         this.savedTeam = this.savedTeam = cloneDeep(res);
  //         this.canCancelChanges = false;
  //       }));
  // }
  // fetchUserTeam() {

  //   let userId = this.authService.getCurrentUserId();

  //   if (userId == undefined)
  //     throwError("User is logged out. Please login to peform this operation");

  //   return this.http.get<Team>('https://world-xi-app-default-rtdb.firebaseio.com/teams/' + userId + '.json')
  //     .pipe(catchError((error: HttpErrorResponse) => throwError(error)),
  //       tap((res: Team) => {
  //         if (res) {
  //           let players = <Player[]>Object.values(res['players']);

  //           if (players && players.length === 11) {
  //             //to keep record before user makes changes
  //             this.savedTeam = cloneDeep(res);
  //             this.setPlayersByPosition(players);
  //           }
  //         }
  //         else {
  //           //we do not have the players so create a an array of undefined players to populate UI
  //           this.setPlayersInPosition(new Array<Player>(1), new Array<Player>(4), new Array<Player>(4), new Array<Player>(2));
  //         }
  //       }));
  // }

  // deleteTeam() {

  //   let userId = this.authService.getCurrentUserId();

  //   if (userId == undefined)
  //     throwError("User is logged out. Please login to peform this operation");

  //   this.http.delete('https://world-xi-app-default-rtdb.firebaseio.com/teams/' + userId + '.json',)
  //     .subscribe({
  //       next: () => {
  //         let formation = this.savedTeam['formation'];

  //         formation ?
  //           this.setPlayersInPosition(new Array<Player>(1), new Array<Player>(+formation[0]), new Array<Player>(+formation[1]), new Array<Player>(+formation[2])) :
  //           this.setPlayersInPosition(new Array<Player>(1), new Array<Player>(4), new Array<Player>(4), new Array<Player>(2));

  //         this.alertService.toggleAlert('ALERT_TEAM_DELETE_SUCCESS', AlertType.Success);
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         this.alertService.toggleAlert('ALERT_TEAM_DELETE_FAILURE', AlertType.Danger, error.message);
  //       }
  //     });
  // }
}