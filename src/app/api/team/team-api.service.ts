import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceResponse } from "src/app/service-response.model";
import { Team } from "src/app/team/team.model";

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
    createTeam(team: Team): Observable<ServiceResponse<Team>> {
        return this.http.post<ServiceResponse<Team>>(this.url, team);
    }

    /**
     * 
     * @param team includes selected players and set formation
     * @returns Saves team for specific user and returns errors if any
     */
    updateTeam(team: Team): Observable<ServiceResponse<Team>> {

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
    deleteTeam():Observable<Object> {
        return this.http.delete(this.url);
    }
}