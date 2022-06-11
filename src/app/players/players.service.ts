import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Subject, tap, throwError } from "rxjs";
import { Player } from "./player.model";

@Injectable({
    providedIn: 'root'
})

export class PlayersService {
    player = new Subject<Player>();

    constructor(private http: HttpClient) { }

    createPlayer(player: Player) {
        return this.http.post<Player>('https://world-xi-app-default-rtdb.firebaseio.com/players.json',
            player)
            .pipe(catchError(errorRes => {
                return throwError(errorRes.error.error)
            }));
    }

    fetchAllPlayers() {
        return this.http.get<{ [key: string]: Player }>('https://world-xi-app-default-rtdb.firebaseio.com/players.json')
            .pipe(catchError(errorRes => { return throwError(errorRes.error.error) }),
                map(res => {
                    let players: Player[] = [];

                    for (let key in res) {
                        if (res.hasOwnProperty(key))
                        {
                            players.push({...res[key]});
                        }
                    }

                    return players;
                }));
    }
}