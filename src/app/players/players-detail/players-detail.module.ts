import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppCommonModule } from "src/app/app-common.module";
import { PlayersRoutingModule } from "../players-routing.module";
import { DeletePlayerModule } from "./delete-player/delete-player.module";
import { PlayersDetailComponent } from "./players-detail.component";

@NgModule({
    declarations: [
        PlayersDetailComponent
    ],
    imports: [
        AppCommonModule,
        CommonModule,
        DeletePlayerModule,
        FontAwesomeModule,
        PlayersRoutingModule
    ],
    exports:[
        PlayersDetailComponent
    ]
})


export class PlayerDetailModule { }