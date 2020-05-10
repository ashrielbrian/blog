import { NgModule } from '@angular/core';
import { GapminderComponent } from './gapminder/gapminder.component';
import { SecondProjComponent } from './second-proj/second-proj.component';
import { ChartComponent } from './gapminder/chart.component';


@NgModule({
    declarations: [
        GapminderComponent,
        SecondProjComponent,
        ChartComponent
    ],
    imports: [],
    providers: [],

})

export class ProjectsModule {

}