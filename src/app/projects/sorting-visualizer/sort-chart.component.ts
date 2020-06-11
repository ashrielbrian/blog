import { Component, ElementRef, OnInit, OnDestroy } from "@angular/core";
import * as d3 from 'd3';
import { SortingSerivce } from './sorting.service';
import { Subscription, Observable } from 'rxjs';

@Component({
    selector: 'app-sort-chart',
    templateUrl: './sort-chart.component.html',
    styleUrls: []
})

export class SortChartComponent implements OnInit, OnDestroy{
    constructor(private ele: ElementRef, private sortService: SortingSerivce) {
        this.hostElement = this.ele.nativeElement as string;
    }

    ngOnInit() {
        this.initialiseChartArea();
        this._subs.add(this.array$.subscribe(arr => {
            if (arr) {
                this.arr = arr;
                this.draw(arr);
            }
        }));
        this._subs.add(this.actions$.subscribe(acts => {
            if (acts) {
                this.animate(acts);
            }
        }));
        this._subs.add(this.isAnimating$.subscribe(is => console.log(is)));
    }

    ngOnDestroy() {
        this._subs.unsubscribe();
    }

    private _subs: Subscription = new Subscription();
    isAnimating$: Observable<boolean> = this.sortService.getAnimation$();
    array$: Observable<number[]> = this.sortService.getArray$();
    actions$: Observable<any[]> = this.sortService.getActions$();
    actions;

    arr: number[];
    hostElement: string;
    svg;
    chart;
    titleLabel: string;
    
    xScale;
    yScale;
    colorScale;
    xAxisGroup;

    margin = {top: 50, right: 10, bottom: 50, left: 10};
    width: number = 800;
    height: number = 640;

    chartWidth = this.width - this.margin.left - this.margin.right;
    chartHeight = this.height - this.margin.top - this.margin.bottom;
    rectWidth;

    initialiseChartArea() {
        this.svg = d3.select(this.hostElement).append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .classed('svg-content-responsive', true);
        this.chart = this.svg.append('g')
            .attr('id', 'chart-area')
            .attr('height', this.chartHeight).attr('width', this.chartWidth)
            .attr('transform', `translate(${this.margin.left},${this.margin.right})`);
        this.xAxisGroup = this.chart.append('g').attr('transform', `translate(0, ${this.margin.top})`);
    }

    initialiseScales() {
        let min = Math.min.apply(null, this.arr);
        let max = Math.max.apply(null, this.arr);
        this.yScale = d3.scaleLinear().range([0, this.chartHeight]).domain([min - 2, max + 2]);
        this.xScale = d3.scaleLinear().range([0, this.chartWidth]).domain([0, this.arr.length]);
        this.colorScale = d3.scaleQuantize<string>().domain([0, this.arr.length]).range(["rgb(222,235,247)","rgb(198,219,239)","rgb(158,202,225)","rgb(107,174,214)","rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)"])
    }

    draw(arr: number[]) {
        this.initialiseScales();
        if (arr?.length > 0) {
            this.rectWidth = Math.floor(this.chartWidth / this.arr.length);
            var rects = this.chart.selectAll('rect').data(arr, Number);
    
            rects.enter().append('rect')
                .attr('fill', d => this.colorScale(d))
                .merge(rects)
                .attr('id', (d, i) => `rect${d}`)
                .attr('x', (d, i) => this.xScale(i))
                .attr('y', '0')
                .attr('width', this.rectWidth)
                .attr('height', d => this.yScale(d));
        }
    }

    animate(actions:any[]) {
        let sortingArr = [...this.arr];
        let duration = 20;
        this.sortService.startAnimation();

        let t = setInterval(() => {
            let act = actions.pop();
            if (act) {
                switch (act.type) {
                    case 'swap':
                        [sortingArr[act.i], sortingArr[act.j]] = [sortingArr[act.j], sortingArr[act.i]];
                        slide(sortingArr[act.i], act.i); // moves the rect to its new location
                        slide(sortingArr[act.j], act.j);
                        break;
                    case 'snapshot':
                        // the second arg for data "Number", is important in order for d3 to identify the rect DOM based on the number
                        // value found in the array. E.g. number 3 corresponds to THIS particular rect; 9 corresponds to THAT rect.
                        var rects = this.chart.selectAll('rect').data(act.arr, Number);
                        rects.transition().duration(duration)
                            .attr('x', (_,i) => this.xScale(i));
                        break;
                }
            } else {
                this.sortService.stopAnimation();
                clearInterval(t);
            }
            
        }, duration);

        var slide = (d, i) => {
            d3.select('#rect' + d).transition().duration(5)
                .attr('x', this.xScale(i));
        }
    }


}