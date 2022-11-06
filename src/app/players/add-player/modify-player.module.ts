import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AppCommonModule } from "src/app/app-common.module";
import { PlayersRoutingModule } from "../players-routing.module";
import { ModifyPlayerComponent } from "./modify-player.component";

@NgModule({
    declarations: [
        ModifyPlayerComponent
    ],
    imports: [
        AppCommonModule,
        CommonModule,
        ReactiveFormsModule,
        PlayersRoutingModule
    ],
    exports: [
        ModifyPlayerComponent
    ]
})


export class ModifyPlayerModule { }