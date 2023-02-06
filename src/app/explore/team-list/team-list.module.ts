import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppCommonModule } from "src/app/app-common.module";
import { TeamListComponent } from "./team-list.component";

@NgModule({
    imports: [
        AppCommonModule,
        CommonModule
    ],
    declarations: [
        TeamListComponent
    ],
    exports:[
        TeamListComponent
    ]
})
export class TeamListModule {

}