import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Position } from "src/app/players/player-position";
import { Player } from "../../players/player.model";
import { ApiService } from "../api.service";
import { PagedResponseDto } from "../Common/paged-response.dto";
import { ServiceResponse } from "../Common/service-response.dto";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class PlayersApiService {

    private readonly url = environment.apiBaseUrl + "/player/";

    constructor(private http: HttpClient, private apiService: ApiService) { }

    createPlayer(player: Player): Observable<ServiceResponse<Player[]>> {
        return this.http.post<ServiceResponse<Player[]>>(this.url, player);
    }


    fetchAllPlayers() {
        return this.http.get<ServiceResponse<PagedResponseDto<Player[]>>>(this.url);
    }

    fetchPlayerById(id: number): Observable<ServiceResponse<Player>> {
        return this.http.get<ServiceResponse<Player>>(this.url + id);
    }

    fetchPlayerByPosition(position: Position, skip?: number, take?: number): Observable<ServiceResponse<PagedResponseDto<Player[]>>> {
        return this.http.get<ServiceResponse<PagedResponseDto<Player[]>>>(this.url + "position/",
            { params: this.apiService.constructParams({ position: position, skip: skip, take: take }) });
    }

    deletePlayer(id: number): Observable<ServiceResponse<Player[]>> {
        return this.http.delete<ServiceResponse<Player[]>>(this.url + id);
    }

    updatePlayer(player: Player): Observable<ServiceResponse<Player[]>> {
        return this.http.put<ServiceResponse<Player[]>>(this.url, player);
    }
}