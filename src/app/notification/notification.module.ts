import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppCommonModule } from "../app-common.module";
import { NotificationComponent } from "./notification.component";

@NgModule({
    imports:[
        AppCommonModule,
        CommonModule
    ],
    declarations:[
    ],
    exports:[
    ]
})
export class NotificationModule{

}