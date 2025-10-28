import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Position } from "src/app/players/player-position";
import { PlayerDto } from "../../players/player.dto";
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

    createPlayer(player: PlayerDto): Observable<ServiceResponse<PlayerDto>> {
        return this.http.post<ServiceResponse<PlayerDto>>(this.url, player);
    }


    fetchAllPlayers() {
        return this.http.get<ServiceResponse<PagedResponseDto<PlayerDto[]>>>(this.url);
    }

    fetchPlayerById(id: number): Observable<ServiceResponse<PlayerDto>> {
        return this.http.get<ServiceResponse<PlayerDto>>(this.url + id);
    }

    fetchPlayerByPosition(position: Position, skip?: number, take?: number): Observable<ServiceResponse<PagedResponseDto<PlayerDto[]>>> {
        return this.http.get<ServiceResponse<PagedResponseDto<PlayerDto[]>>>(this.url + "position/",
            { params: this.apiService.constructParams({ position: position, skip: skip, take: take }) });
    }

    deletePlayer(id: number): Observable<ServiceResponse<PlayerDto[]>> {
        return this.http.delete<ServiceResponse<PlayerDto[]>>(this.url + id);
    }

    updatePlayer(player: PlayerDto): Observable<ServiceResponse<PlayerDto[]>> {
        return this.http.put<ServiceResponse<PlayerDto[]>>(this.url, player);
    }

    getUploadSasUrls(playerId: number, contentType: string): Observable<ServiceResponse<{ uploadUrl: string, photoBlobName: string }>> {
        return this.http.post<ServiceResponse<{ uploadUrl: string; photoBlobName: string }>>(
            `${this.url}${playerId}/photo/sas`, {}, { params: this.apiService.constructParams({ contentType }) }
        );
    }

    savePlayerPhoto(playerId: number, photoBlobName: string): Observable<void> {
        return this.http.put<void>(`${this.url}${playerId}/photo`, { blobName: photoBlobName });
    }
}