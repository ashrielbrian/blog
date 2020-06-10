import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GapminderComponent } from './projects/gapminder/gapminder.component';
import { SortingVisualizerComponent } from './projects/sorting-visualizer/sorting-visualizer.component';


const routes: Routes = [
  {
    path: 'gapminder', component: GapminderComponent,
  },
  {
    path: 'sort', component: SortingVisualizerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
