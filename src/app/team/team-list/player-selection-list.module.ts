import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppCommonModule } from "src/app/app-common.module";
import { PlayersInPositionModule } from "./players-in-position/players-in-position.module";
import { PlayerSelectionListComponent } from "./player-selection-list.component";

@NgModule({
    declarations:[
        PlayerSelectionListComponent
    ],
    imports:[
        AppCommonModule,
        CommonModule,
        PlayersInPositionModule
    ],
    exports: [
        PlayerSelectionListComponent,
    ]
})
export class PlayerSelectionListModule {

}