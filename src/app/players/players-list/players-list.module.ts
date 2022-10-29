import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppCommonModule } from "src/app/app-common.module";
import { PlayersRoutingModule } from "../players-routing.module";
import { PlayersListComponent } from "./players-list.component";

@NgModule({
    declarations: [
        PlayersListComponent
    ],
    imports: [
        AppCommonModule,
        CommonModule,
        FontAwesomeModule,
        PlayersRoutingModule

    ],
    exports:[
        PlayersListComponent
    ]
})


export class PlayerListModule { }