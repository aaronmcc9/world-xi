import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatGridListModule } from "@angular/material/grid-list";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./api/Common/dropdown.directive";
import { ErrorComponent } from "./error/error.component";
import { HeaderComponent } from "./header/header/header.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

@NgModule({
    declarations: [
        AlertComponent,
        ErrorComponent,
        // HeaderComponent,
        LoadingSpinnerComponent,
        DropdownDirective

    ],
    imports: [
        CommonModule,
        RouterModule,
        MatGridListModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        FontAwesomeModule,
    ],
    exports: [
        AlertComponent,
        ErrorComponent,
        // HeaderComponent,
        MatGridListModule,
        FlexLayoutModule,
        LoadingSpinnerComponent,
        TranslateModule,
        FontAwesomeModule,
        DropdownDirective
    ]
})
export class AppCommonModule {

}