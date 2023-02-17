import { Formation } from "../api/team/formation/formation.model";
import { Result } from "../api/team/result/result.dto";
import { FriendRequestStatus } from "../api/User/Friend/friend request/friend-request-status.enum";
import { User } from "../api/User/user.dto";
import { Player } from "../players/player.model";

export class Team {

    constructor(public id: number, public teamName: string,
        public user: User,
        public players: Player[], public formation: Formation,
        public results: Result[], public wins: number,
        public losses: number, public draws: number,
        public friendRequestStatus?: FriendRequestStatus,
        public friendRequestSending?: boolean) { }
}
