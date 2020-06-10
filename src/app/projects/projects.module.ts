import { NgModule } from '@angular/core';
import { GapminderComponent } from './gapminder/gapminder.component';
import { ChartComponent } from './gapminder/chart.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { SortingVisualizerComponent } from './sorting-visualizer/sorting-visualizer.component';
import { SortChartComponent } from './sorting-visualizer/sort-chart.component';


@NgModule({
    declarations: [
        GapminderComponent,
        ChartComponent,
        SortingVisualizerComponent,
        SortChartComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
        
    ],
    providers: [
    ],

})

export class ProjectsModule {

}