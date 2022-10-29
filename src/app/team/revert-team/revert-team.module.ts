import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppCommonModule } from "src/app/app-common.module";
import { RevertTeamComponent } from "./revert-team.component";

@NgModule({
    declarations:[
        RevertTeamComponent
    ],
    imports:[
        AppCommonModule,
        CommonModule,
    ],
    exports: [
        RevertTeamComponent
    ]
})
export class RevertTeamModule {

}