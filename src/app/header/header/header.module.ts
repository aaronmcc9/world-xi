import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppCommonModule } from "src/app/app-common.module";
import { HeaderComponent } from "./header.component";

@NgModule({
    declarations: [
        // HeaderComponent
    ],
    imports: [
        // CommonModule
        AppCommonModule,

    ],
    exports: [
        // HeaderComponent
    ]
})


export class HeaderModule { }   