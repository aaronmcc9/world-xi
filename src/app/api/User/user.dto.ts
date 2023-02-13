import { Friend } from "./Friend/friend.dto";

export interface User {
    id: number;
    username: string;
    email: string;
    notifications: Notification[];
    friends: Friend[];
}