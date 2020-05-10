import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GapminderComponent } from './projects/gapminder/gapminder.component';
import { SecondProjComponent } from './projects/second-proj/second-proj.component';


const routes: Routes = [
  {
    path: 'gapminder', component: GapminderComponent,
  },
  {
    path: 'second-proj', component: SecondProjComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
