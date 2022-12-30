import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppCommonModule } from "../app-common.module";
import { ModifyPlayerModule } from "./modify-player/modify-player.module";
import { PlayerDetailModule } from "./players-detail/players-detail.module";
import { PlayerListModule } from "./players-list/players-list.module";
import { PlayersRoutingModule } from "./players-routing.module";
import { PlayersComponent } from "./players.component";

@NgModule({
    declarations: [
        PlayersComponent
    ],
    imports: [
        AppCommonModule,
        CommonModule,
        ModifyPlayerModule,
        PlayerListModule,
        PlayerDetailModule,
        PlayersRoutingModule,
    ],
    exports: [
        PlayerListModule,
        ModifyPlayerModule,
        PlayerDetailModule,
        PlayersRoutingModule
    ]
})


export class PlayersModule { }