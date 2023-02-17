import { User } from "src/app/api/User/user.dto";
import { FriendRequestStatus } from "./friend-request-status.enum";

export interface FriendRequest {
    id: number;
    userSentId: number;
    userReceivedId: number;
    userSent?: User;
    userReceived?: User;
    status: FriendRequestStatus;
    created: Date;
}