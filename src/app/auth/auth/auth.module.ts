import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import { AppCommonModule } from "src/app/app-common.module";
import { AuthComponent } from "./auth.component";

@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        AppCommonModule,
        CommonModule,
        FontAwesomeModule,
        ReactiveFormsModule,
    ],
    exports:[
        AuthComponent
    ]
})


export class AuthModule { }