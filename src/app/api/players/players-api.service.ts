import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ServiceResponse } from "../../service-response.model";
import { Player } from "../../players/player.model";
import { Position } from "src/app/players/player-position";

@Injectable({
    providedIn: 'root'
})

export class PlayersApiService {
    
    private readonly url = "https://localhost:7258/api/player/";

    constructor(private http: HttpClient) { }

    createPlayer(player: Player): Observable<ServiceResponse<Player[]>> {
        return this.http.post<ServiceResponse<Player[]>>(this.url, player);
    }


    fetchAllPlayers() {
        return this.http.get<ServiceResponse<Player[]>>(this.url);
    }

    fetchPlayerById(id: number): Observable<ServiceResponse<Player>> {
        return this.http.get<ServiceResponse<Player>>(this.url + id);
    }

    deletePlayer(id: number): Observable<ServiceResponse<Player[]>> {
        return this.http.delete<ServiceResponse<Player[]>>(this.url + id);
    }

    updatePlayer(player: Player): Observable<ServiceResponse<Player[]>> {
        return this.http.put<ServiceResponse<Player[]>>(this.url, player);
    }
}