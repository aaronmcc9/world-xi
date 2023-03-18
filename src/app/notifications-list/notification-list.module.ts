import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppCommonModule } from "../app-common.module";
import { NotificationsListComponent } from "./notifications-list.component";

@NgModule({
    imports:[
        AppCommonModule,
        CommonModule
    ],
    declarations:[
        NotificationsListComponent
    ]
})
export class NotificationListModule{

}