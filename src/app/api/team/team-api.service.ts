import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Team } from "src/app/team/team.model";
import { ServiceResponse } from "../Common/service-response.dto";
import { ModifyTeamDto } from "./modify-team.dto";

@Injectable({
    providedIn: 'root'
})

export class TeamApiService {

    private readonly url = "https://localhost:7258/api/team/"

    constructor(private http: HttpClient) { }

    /**
     * 
     * @param team includes selected players and set formation
     * @returns Saves team for specific user and returns errors if any
     */
    createTeam(team: ModifyTeamDto): Observable<ServiceResponse<Team>> {
        return this.http.post<ServiceResponse<Team>>(this.url, team);
    }

    /**
     * 
     * @param team includes selected players and set formation
     * @returns Saves team for specific user and returns errors if any
     */
    updateTeam(team: ModifyTeamDto): Observable<ServiceResponse<Team>> {

        return this.http.put<ServiceResponse<Team>>(this.url, team);
    }



    /**
   * 
   * @returns The users saved team should the have one
   */
    fetchUserTeam(): Observable<ServiceResponse<Team>> {
        return this.http.get<ServiceResponse<Team>>(this.url);
    }

    /**
    * deletes user team
    */
    deleteTeam():Observable<ServiceResponse<null>> {
        return this.http.delete<ServiceResponse<null>>(this.url);
    }
}