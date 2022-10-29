import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppCommonModule } from "src/app/app-common.module";
import { ModifySelectionComponent } from "./modify-selection.component";

@NgModule({
    declarations: [
        ModifySelectionComponent
    ],
    imports: [
        AppCommonModule,
        CommonModule
    ],
    exports: [
        ModifySelectionComponent
    ]
})
export class ModifySelectionModule {

}