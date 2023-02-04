import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatTabsModule } from '@angular/material/tabs';
import { AppCommonModule } from "src/app/app-common.module";
import { ExploreComponent } from "./explore.component";
import { TeamListItemModule } from "./team-list-item/team-list-item.module";

@NgModule({
    imports: [
        AppCommonModule,
        CommonModule,
        FontAwesomeModule,
        MatTabsModule,
        TeamListItemModule
    ],
    declarations: [
        ExploreComponent
    ]
})
export class ExploreModule {

}