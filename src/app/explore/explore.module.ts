import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatTabsModule } from '@angular/material/tabs';
import { AppCommonModule } from "src/app/app-common.module";
import { ExploreComponent } from "./explore.component";
import {  TeamListModule } from "./team-list/team-list.module";

@NgModule({
    imports: [
        AppCommonModule,
        CommonModule,
        FontAwesomeModule,
        MatTabsModule,
        TeamListModule
    ],
    declarations: [
        ExploreComponent
    ]
})
export class ExploreModule {

}