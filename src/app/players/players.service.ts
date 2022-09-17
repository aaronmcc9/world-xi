import { HttpClient } from "@angular/common/http";
import { ThisReceiver } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { catchError, map, Subject, tap, throwError } from "rxjs";
import { Player } from "./player.model";

@Injectable({
    providedIn: 'root'
})

export class PlayersService {
    players: Player[] = [];
    playersChanged = new Subject<Player[]>();

    constructor(private http: HttpClient) { }

    createPlayer(player: Player) {
        return this.http.post<{ name: string }>('https://world-xi-app-default-rtdb.firebaseio.com/players.json',
            player)
            .pipe(catchError(errorRes => {
                return throwError(errorRes.error.error)
            }),
                tap(key => {
                    this.players.push({ ...player, id: key.name });
                    this.playersChanged.next(this.players.slice());
                }));
    }

    fetchAllPlayers() {
        return this.http.get<{ [key: string]: Player }>('https://world-xi-app-default-rtdb.firebaseio.com/players.json')
            .pipe(catchError(errorRes => { return throwError(errorRes.error.error) }),
                map(res => {
                    let players: Player[] = [];

                    for (let key in res) {
                        if (res.hasOwnProperty(key)) {
                            players.push({ ...res[key], id: key });
                        }
                    }
                    
                    this.players = players;
                    this.playersChanged.next(this.players.slice());
                    
                    return players.slice();
                }));
    }

    fetchPlayerById(id: string) {
        return this.http.get<Player>('https://world-xi-app-default-rtdb.firebaseio.com/players/' + id + ".json")
            .pipe(catchError(errorRes => {
                return throwError(errorRes.message)
            }),
                map(res => {

                    return { ...res, id: id };
                }));
    }

    deletePlayer(id: string) {
        return this.http.delete<Player>('https://world-xi-app-default-rtdb.firebaseio.com/players/' + id + ".json")
            .pipe(catchError(errorRes => { return throwError(errorRes.message) }),
                tap(res => {

                    this.players = this.players.filter(player => {
                        return player.id != id;
                    });

                    this.playersChanged.next(this.players.slice())
                })
            );
    }

    updatePlayer(player: Player) {
        return this.http.put<Player>('https://world-xi-app-default-rtdb.firebaseio.com/players/' + player.id + ".json",
            player)
            .pipe(catchError(errorRes => { return throwError(errorRes.message) }),
                tap(() => {

                    const index = this.players.findIndex((playerObj) => {
                        return playerObj.id == player.id
                    });

                    if (index != -1) {
                        this.players[index] = player
                    }
                    
                    this.playersChanged.next(this.players.slice());
                }));
    }

    getPlayerCountByPosition(position : string){
        return this.players.filter((player : Player) => {
            return player.position === position;
        }).length;
    }
}