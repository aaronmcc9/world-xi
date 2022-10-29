import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppCommonModule } from "src/app/app-common.module";
import { PlayersInPositionComponent } from "./players-in-position.component";

@NgModule({
    declarations:[
        PlayersInPositionComponent
    ],
    imports:[
        AppCommonModule,
        CommonModule,
        FontAwesomeModule
    ],
    exports: [
        PlayersInPositionComponent
    ]
})
export class PlayersInPositionModule {

}