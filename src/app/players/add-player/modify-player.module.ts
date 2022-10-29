import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AppCommonModule } from "src/app/app-common.module";
import { PlayersRoutingModule } from "../players-routing.module";
import { AddPlayerComponent } from "./add-player.component";

@NgModule({
    declarations: [
        AddPlayerComponent
    ],
    imports: [
        AppCommonModule,
        CommonModule,
        ReactiveFormsModule,
        PlayersRoutingModule
    ],
    exports: [
        AddPlayerComponent
    ]
})


export class ModifyPlayerModule { }