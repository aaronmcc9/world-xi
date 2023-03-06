import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppCommonModule } from "src/app/app-common.module";
import { TeamInfoComponent } from "./team-info.component";

@NgModule({
    imports:[
        AppCommonModule,
        CommonModule,
    ],
    declarations:[
        TeamInfoComponent
    ],
    exports:[
        TeamInfoComponent
    ]
})
export class TeamInfoModule{

}