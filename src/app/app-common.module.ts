import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatGridListModule } from "@angular/material/grid-list";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./common/dropdown.directive";
import { PageNavigationComponent } from "./common/page-navigation/page-navigation.component";
import { PageNavigationModule } from "./common/page-navigation/page-navigation.module";
import { ErrorComponent } from "./error/error.component";
import { HeaderComponent } from "./header/header/header.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { NotificationComponent } from "./notification/notification.component";
import { NotificationModule } from "./notification/notification.module";

@NgModule({
    declarations: [
        AlertComponent,
        DropdownDirective,
        ErrorComponent,
        // HeaderComponent,
        LoadingSpinnerComponent,
        NotificationComponent,
        PageNavigationComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatGridListModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        FontAwesomeModule
    ],
    exports: [
        AlertComponent,
        DropdownDirective,
        ErrorComponent,
        // HeaderComponent,
        FlexLayoutModule,
        FontAwesomeModule,
        LoadingSpinnerComponent,
        MatGridListModule,
        NotificationComponent,
        PageNavigationComponent,
        RouterModule,
        TranslateModule
    ]
})
export class AppCommonModule {

}