import { NgModule } from '@angular/core';
import { GapminderComponent } from './gapminder/gapminder.component';
import { SecondProjComponent } from './second-proj/second-proj.component';
import { ChartComponent } from './gapminder/chart.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        GapminderComponent,
        SecondProjComponent,
        ChartComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
        
    ],
    providers: [
    ],

})

export class ProjectsModule {

}