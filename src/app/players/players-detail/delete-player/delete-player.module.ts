import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppCommonModule } from "src/app/app-common.module";
import { DeletePlayerComponent } from "./delete-player.component";

@NgModule({
    declarations: [
        DeletePlayerComponent
    ],
    imports: [
        AppCommonModule,
        CommonModule
    ],
    exports: [
        DeletePlayerComponent
    ]
})


export class DeletePlayerModule { }