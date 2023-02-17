import { FriendRequestStatus } from "./friend-request-status.enum";

export interface UpdateFriendRequest {
    userSentId: number;
    userReceivedId: number;
    status: FriendRequestStatus;
}