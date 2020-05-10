import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-gapminder',
  templateUrl: './gapminder.component.html',
  styleUrls: ['./gapminder.component.css']
})
export class GapminderComponent implements OnInit {

  chartData = ['hey', 'two', 'one'];
  constructor() {

   }

   ngOnInit(){}

}
