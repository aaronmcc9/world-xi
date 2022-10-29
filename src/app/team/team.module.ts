import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppCommonModule } from "../app-common.module";
import { ModifyPlayerModule } from "../players/add-player/modify-player.module";
import { FormationRowModule } from "./formation-row/formation-row.module";
import { ModifySelectionModule } from "./modify-selection/modify-selection.module";
import { RevertTeamModule } from "./revert-team/revert-team.module";
import { TeamListModule } from "./team-list/team-list.module";
import { TeamComponent } from "./team.component";

@NgModule({
    declarations:[
        TeamComponent
    ],
    imports:[
        AppCommonModule,
        CommonModule,
        ReactiveFormsModule,
        FormationRowModule,
        ModifySelectionModule,
        RevertTeamModule,
        TeamListModule,
        FontAwesomeModule
    ],
    exports: [
        TeamComponent,
        FormationRowModule,
        ModifySelectionModule,
        RevertTeamModule,
        TeamListModule
    ]
})
export class TeamModule {

}