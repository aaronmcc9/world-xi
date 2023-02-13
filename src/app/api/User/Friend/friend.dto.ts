import { Team } from "src/app/team/team.model";

export interface Friend {
    id: number;
    userId: number;
    username: string;
    team: Team;
}