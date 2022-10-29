import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppCommonModule } from "src/app/app-common.module";
import { FormationRowComponent } from "./formation-row.component";

@NgModule({
    declarations: [
        FormationRowComponent
    ],
    imports: [
        AppCommonModule,
        CommonModule
    ],
    exports: [
        FormationRowComponent
    ]
})
export class FormationRowModule {

}