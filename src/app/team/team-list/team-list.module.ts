import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppCommonModule } from "src/app/app-common.module";
import { PlayersInPositionModule } from "./players-in-position/players-in-position.module";
import { TeamListComponent } from "./team-list.component";

@NgModule({
    declarations:[
        TeamListComponent
    ],
    imports:[
        AppCommonModule,
        CommonModule,
        PlayersInPositionModule
    ],
    exports: [
        TeamListComponent,
        // PlayersInPositionModule
    ]
})
export class TeamListModule {

}