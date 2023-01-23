import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AppCommonModule } from "src/app/app-common.module";
import { SettingsComponent } from "./settings.component";

@NgModule({
    imports:[
        AppCommonModule,
        CommonModule,
        ReactiveFormsModule
    ],
    declarations:[
        SettingsComponent
    ]
})
export class SettingsModule{

}