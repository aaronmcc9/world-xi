import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Team } from "src/app/team/team.model";
import { ApiService } from "../api.service";
import { ServiceResponse } from "../Common/service-response.dto";
import { ModifyTeamDto } from "./modify-team.dto";
import { Settings } from "./settings.dto";

@Injectable({
    providedIn: 'root'
})

export class TeamApiService {

    private readonly url = "https://localhost:7258/api/team/";

    constructor(private http: HttpClient, private apiService: ApiService) { }

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
    fetchUserTeam(id?: number): Observable<ServiceResponse<Team>> {
        let key = id ? id : ""; 
            console.log("hi", id);
        return this.http.get<ServiceResponse<Team>>(this.url + key);
    }

    /**
    * deletes user team
    */
    deleteTeam(): Observable<ServiceResponse<null>> {
        return this.http.delete<ServiceResponse<null>>(this.url);
    }

    /**
    * 
    * @returns The users saved team settings should they have one
    */
    fetchTeamSettings(): Observable<ServiceResponse<Settings>> {
        return this.http.get<ServiceResponse<Settings>>(this.url + "settings");
    }

    /**
    * 
    * @returns Boolean of whether username is taken
    */
    checkUsernameExists(name: string): Observable<ServiceResponse<boolean>> {
        return this.http.get<ServiceResponse<boolean>>(this.url + "settings/username",
            { params: this.apiService.constructParams({ name: name }) });
    }

    /**
    * 
    * @returns Boolean of whether username is taken
    */
    checkTeamNameExists(name: string): Observable<ServiceResponse<boolean>> {
        return this.http.get<ServiceResponse<boolean>>(this.url + "settings/teamName",
            { params: this.apiService.constructParams({ name: name }) });
    }

    /**
   * 
   * @returns The users saved team settings should they have one
   */
    updateTeamSettings(settings: Settings): Observable<ServiceResponse<Settings>> {
        return this.http.put<ServiceResponse<Settings>>(this.url + "settings", settings);
    }

    fetchAllTeams(friends: boolean, filterText?: string): Observable<ServiceResponse<Team[]>> {
        return this.http.get<ServiceResponse<Team[]>>(this.url + "all",
            { params: this.apiService.constructParams({ friends: friends, filterText: filterText }) })
    }
}