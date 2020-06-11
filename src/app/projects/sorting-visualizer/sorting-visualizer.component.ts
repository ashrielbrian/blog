import { Component, OnInit } from '@angular/core';
import { SortingSerivce } from './sorting.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.css']
})
export class SortingVisualizerComponent implements OnInit {

  constructor(private sortService: SortingSerivce) { }

  isAnimating$: Observable<boolean> = this.sortService.getAnimation$();
  ngOnInit(): void {}

  bubbleSort() {
    this.sortService.callBubbleSort();
  }

  mergeSort() {
    this.sortService.callIterativeMergeSort();
  }
}
