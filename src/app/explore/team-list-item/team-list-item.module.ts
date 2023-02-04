import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppCommonModule } from "src/app/app-common.module";
import { TeamListItemComponent } from "./team-list-item.component";

@NgModule({
    imports: [
        AppCommonModule,
        CommonModule
    ],
    declarations: [
        TeamListItemComponent
    ],
    exports:[
        TeamListItemComponent
    ]
})
export class TeamListItemModule {

}