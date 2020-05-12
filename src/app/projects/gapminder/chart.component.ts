import { Component, OnInit, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { Continent, YearData, DataService, CountryData } from './data.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy{

  /*** 
  ** Component to draw the chart. All data formatting and state management is handled by DataService.
  ** This component only has "eyes" to see a single YearData and draws its chart accordingly. It has no
  ** concern of what the UI or current state is other than the current year data.
  ** This ensures d3 is only doing what it does best - drawing charts - separate from other Angular
  ** functionalities.
  */
  constructor(private ele: ElementRef, public dataService: DataService) { 
    this.hostElement = ele.nativeElement as string;
  }
  @Input() transitionTime: number = 100; // time it takes for a full transition in ms
  private _yearData$: Observable<YearData> = this.dataService.getYearData$(); // tracks the current year data that will be used to draw the chart
  private isAnimating: boolean = false; // checks whether the graph is currently being animated
  private _isAnimating$: Observable<boolean> = this.dataService.getIsAnimating$(); 
  private _subs: Subscription = new Subscription();

  continents : Continent[] = this.dataService.continents; // stores all the continents in the data
  hostElement: string;  // the parent host element of the svg
  svg;  // svg element wherein all chart elements are drawn: labels, axes, data points, title, legends
  chart;  // the main chart element to hold the data points. Axes are based on this
  titleLabel; // title label of the chart

  xScale; // d3 function to output pixels in x-direction based on country income input
  yScale; // d3 function to output pixels in y-direction based on country life-expectancy input
  rScale; // d3 function to output area of datum based on country population
  ordScale; // d3 function to output colour based on the datum continent
  xAxisGroup; // group elements of the x-axis
  yAxisGroup; // group elements of the y-axis

  // Defines dimensions of the chart
  margin = {top: 50, bottom: 50, left: 75, right: 20};
  width = 800;
  height = 640;
  chartWidth = this.width - this.margin.left - this.margin.right;
  chartHeight = this.height - this.margin.top - this.margin.bottom;

  ngOnDestroy() {
    this._subs.unsubscribe();
  }

  ngOnInit() {
    this.initialiseChart();
    this._subs.add(this._yearData$.subscribe(yearData => {
      if (yearData) {
        // if there is data, update the chart
        this.titleLabel.text(yearData.year);
        this.update(yearData.countriesData);
      }
    }));

    this._subs.add(this._isAnimating$.subscribe(animating => {
      this.isAnimating = animating;
    }));
  }

  initialiseChart() {
    this.initialiseChartArea();
    this.drawLabels();
    this.initialiseScales();
    this.drawLegends();
  }

  initialiseChartArea() {
    // sets up the chart area to be drawn on
    this.svg = d3.select(this.hostElement).append('svg')
      .attr('height', this.height).attr('width', this.width);
    this.chart = this.svg.append('g')
      .attr('id', 'chart-area')
      .attr('height', this.chartHeight).attr('width', this.chartWidth)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.xAxisGroup = this.chart.append('g').attr('transform', `translate(0, ${this.chartHeight})`);
    this.yAxisGroup = this.chart.append('g');
  }

  drawLabels() {
    // draws the title, y and x-axis labels
    this.titleLabel = this.svg.append('text')
      .attr('x', (this.chartWidth + this.margin.left) / 2)
      .attr('y', this.margin.top)
      .attr('font-size', 40);
    var yAxisLabel = this.svg.append('text')
      .attr('transform', `translate(${this.margin.right}, ${(this.height + this.margin.top) / 2}) rotate(-90)`)
      .text('Life Expectancy (years)');
    var xAxisLabel = this.svg.append('text')
      .attr('x', `${(this.width + this.margin.left) / 2}`).attr('y', `${this.height - 10}`)
      .text('GDP per Capita ($)');
  }

  drawLegends() {
    // draws the continent legends
    var legend = this.svg.append('g')
      . attr('class', 'ordinalLegend').attr('transform', `translate(${this.chartWidth * 0.9}, ${this.chartHeight - 100})`);

    this.continents.forEach((c,i)=> {
      if (c != Continent.All) {
        let legendRow = legend.append('g').attr('transform', `translate(0, ${i * 30})`);
        legendRow.append('text').attr('x', 25).attr('y', 15).text(c);
        legendRow.append('rect').attr('width',20).attr('height', 20).attr('fill', this.ordScale(c));
      }
    })
  }

  initialiseScales() {
    // initialises the d3 function scales
    this.xScale = d3.scaleLog().range([0, this.chartWidth]).base(10).domain([142, 200000]); // GDP per cap
    this.yScale = d3.scaleLinear().range([this.chartHeight, 0]).domain([0, 100]); // life expectancy
    this.rScale = d3.scaleSqrt().range([5, 60]).domain([2000, 1400000000]); // setting min to 5, max pixel size to 60px
    this.ordScale = d3.scaleOrdinal(d3.schemePaired); // sets the colours of the continents
  }

  update(updatedCountryData) {
    // draws up all the data points for a single set of YearData

    var t = d3.transition().duration(this.transitionTime);
  
    // get the existing circles and join data
    var circles = this.chart.selectAll('circle')
      .data(updatedCountryData, d => d.country);
  
    // remove circle elements that do not have an associated data point
    circles.exit().remove();
          
    circles.enter().append('circle')
        .attr('fill', d => this.ordScale(d.continent))
        .on('mouseover', (d,i,n) => this.handleMouseOver(d,i,n))
        .on('mouseleave', (d,i,n) => this.handleMouseExit(d,i,n))
      .merge(circles)
        .transition(t)
        .attr('cx', d => this.xScale(d.income))
        .attr('cy', d => this.yScale(d.lifeExpectancy))
        .attr('r', d => this.rScale(d.population));

    this.xAxisGroup.call(d3.axisBottom(this.xScale).tickValues([400, 4000, 40000]).tickFormat(d3.format("$")));
    this.yAxisGroup.call(d3.axisLeft(this.yScale));

    // prevents any user interaction with the circles during animation
    if (this.isAnimating) {
      this.chart.selectAll('circle').attr('pointer-events', 'none');  
    } else {
      this.chart.selectAll('circle').attr('pointer-events', 'auto');  
    }
  }

  handleMouseOver(d: CountryData, i, n) {
    // highlights the hovered element with colour
    d3.select(d3.event.currentTarget)
      .attr('fill', 'orange')
      .attr('r', this.rScale(d.population) * 1.5)
    
    // shows the text tooltip
    this.svg.append('text')
      .attr('id', 'tooltip')
      .attr('x', this.xScale(d.income))
      .attr('y', this.yScale(d.lifeExpectancy))
      .text(`${d.country}, ${d.continent}`);

    // draws datum-specific gridlines
    this.drawHorizontalLine(d);
    this.drawVerticalLine(d);
  }
  
  handleMouseExit(d: CountryData, i, n) {
    // returns elements to original colour/shape
    d3.select(d3.event.currentTarget)
      .attr('fill', this.ordScale(d.continent))
      .attr('r', this.rScale(d.population));

    // removes text tooltip and datum-specific gridlines
    d3.select('#tooltip').remove();
    d3.selectAll('.dashed-line').remove();
  }

  drawHorizontalLine(d: CountryData) {
    // draws a horizontal line to the y-axis on hover of a country
    this.chart.append('line')
      .attr('class','dashed-line')
      .attr('x1', 0)
      .attr('y1', this.yScale(d.lifeExpectancy))
      .attr('x2', this.xScale(d.income))
      .attr('y2', this.yScale(d.lifeExpectancy))
      .style("stroke-dasharray", ("3, 3"))
      .style('stroke', this.ordScale(d.continent))
      .style('stroke-opacity', 0.9);
  }

  drawVerticalLine(d: CountryData) {
    // draws a vertical line to the x-axis on hover of a country
    this.chart.append('line')
      .attr('class','dashed-line')
      .attr('x1', this.xScale(d.income))
      .attr('y1', this.chartHeight)
      .attr('x2', this.xScale(d.income))
      .attr('y2', this.yScale(d.lifeExpectancy))
      .style("stroke-dasharray", ("3, 3"))
      .style('stroke', this.ordScale(d.continent))
      .style('stroke-opacity', 0.9);
  }

}
