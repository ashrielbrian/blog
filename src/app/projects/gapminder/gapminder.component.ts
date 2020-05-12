import { Component, OnInit } from '@angular/core';
import { DataService, Continent } from './data.service';
import { FormGroup, FormControl } from '@angular/forms';
import * as d3 from 'd3';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-gapminder',
  templateUrl: './gapminder.component.html',
  styleUrls: ['./gapminder.component.css']
})
export class GapminderComponent implements OnInit {

  /*** 
  ** Handles all the UI interactions. It has no concern as to the state of the data,
  **  nor the charts to be drawn. It is only concerned with user-input interactions 
  ** and relays them to DataService.
  **/

  transitionTime: number = 50; // time it takes between years, and length of animation, in milliseconds
  isContinue: boolean = false; // used to inform DataService whether to cycle through the data years
  isAnimating$: Observable<boolean> = this.dataService.getIsAnimating$(); 
  continents: Continent[] = this.dataService.continents;
  private _subs: Subscription = new Subscription();
  private get dropdownControl(): FormControl { return this.gapminderForm.controls['dropdownCtrl'] as FormControl; }
  private get sliderControl(): FormControl { return this.gapminderForm.controls['sliderCtrl'] as FormControl; }

  gapminderForm: FormGroup;
  continentSelected: string; // used to inform DataService the continent selected by the user
  interval; // variable to hold the SetInterval used when cycling through years

  constructor(private dataService: DataService) {}

  toggleCircle() {
    // disables any user interaction with the data if animating
    var chart = d3.select('svg').select('#chart-area');
    var circles = chart.selectAll('circle')
    
    if (this.isContinue) {
      circles.attr('pointer-events', 'none');
    } else {
      circles.attr('pointer-events', 'auto');
    }
  }

  async ngOnInit() {
    this.gapminderForm = new FormGroup({
      sliderCtrl: new FormControl(),
      dropdownCtrl: new FormControl(Continent.All)
    });

    this.dropdownControl.valueChanges.subscribe(c => {
      this.dataService.updateContinent(c);
      this.toggleCircle();
    });

    this._subs.add(this.isAnimating$.subscribe(animating => {
      this.isContinue = animating;
    }));

    await this.dataService.loadGapminderData();
  }

  slider(event: Event) {
    // selects a specific year
    let selectedYear = event.target['value'] as number;
    this.dataService.updateTime(selectedYear);
    this.toggleCircle();
  }

  start() {
    // starts the cycle
    this.sliderControl.disable();
    this._updateAnimatingStatus(true);
    this.interval = setInterval(() => {
      this.dataService.step();
    }, this.transitionTime); 
    this.toggleCircle();
  }
  
  reset() {
    // resets cycle to Year 1800
    if (this.isContinue) {this.sliderControl.disable(); }
    else {this.sliderControl.enable(); }
    this.toggleCircle();
    this.dataService.reset();
  }

  wait() {
    // pauses the cycle
    this.sliderControl.enable();
    this._updateAnimatingStatus(false);
    this.toggleCircle();
    clearInterval(this.interval);
  }

  private _updateAnimatingStatus(newStatus: boolean) {
    this.isContinue = newStatus;
    this.dataService.updateIsAnimating(newStatus);
  }

}
