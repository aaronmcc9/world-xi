import { User } from "src/app/api/User/user.dto";
import { NotificationType } from "./notification-type.enum";

export interface Notification {
    id: number;
    sender?: User;
    senderId?: number;
    recipientId: number;
    message: number;
    notificationType: NotificationType;
    sent: Date;

}