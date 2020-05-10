import { Component, OnInit, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor(private ele: ElementRef) { 
    this.hostElement = ele.nativeElement as string;
  }
  @Input() data;
  hostElement: string;
  svg;
  chart;
  titleLabel;

  xScale;
  yScale;
  rScale;
  ordScale;
  xAxisGroup;
  yAxisGroup;


  margin = {top: 50, bottom: 50, left: 75, right: 20};
  width = 1000;
  height = 800;
  chartWidth = this.width - this.margin.left - this.margin.right;
  chartHeight = this.height - this.margin.top - this.margin.bottom;

  ngOnInit() {
    this.initialiseChartArea();
    this.drawLabels();
    this.initialiseScales();
    
    d3.json('https://raw.githubusercontent.com/adamjanes/udemy-d3/master/05/5.10.0/data/data.json').then(data => {
      const timePerYear = 100;    
    
      var i = 0;
      var interval = d3.interval(() => {
        if (i < data.length) {
          let yearData = data[i];
          let updatedCountryData = this.formatData(yearData);
          this.update(updatedCountryData, timePerYear);
        } else {
          // stop the loop
          this.chart.selectAll('circle')
            .attr('pointer-events', 'auto');
          interval.stop();
        }
        i ++
      }, timePerYear);
      
    });
  }

  initialiseChartArea() {
    this.svg = d3.select(this.hostElement).append('svg')
      .attr('height', this.height).attr('width', this.width);
    this.chart = this.svg.append('g')
      .attr('height', this.chartHeight).attr('width', this.chartWidth)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.xAxisGroup = this.chart.append('g').attr('transform', `translate(0, ${this.chartHeight})`);
    this.yAxisGroup = this.chart.append('g');
  }

  drawLabels() {
    this.titleLabel = this.svg.append('text')
      .attr('x', (this.chartWidth + this.margin.left) / 2)
      .attr('y', this.margin.top);
    var yAxisLabel = this.svg.append('text')
      .attr('transform', `translate(${this.margin.right}, ${(this.height + this.margin.top) / 2}) rotate(-90)`)
      .text('Life Expectancy (years)');
    var xAxisLabel = this.svg.append('text')
      .attr('x', `${(this.width + this.margin.left) / 2}`).attr('y', `${this.height - 10}`)
      .text('GDP per capita ($)');
  }

  initialiseScales() {
    this.xScale = d3.scaleLog().range([0, this.chartWidth]).base(10).domain([142, 150000]); // GDP per cap
    this.yScale = d3.scaleLinear().range([this.chartHeight, 0]); // life expectancy
    this.rScale = d3.scaleSqrt().range([5, 60]); // setting min to 5, max pixel size to 60px
    this.ordScale = d3.scaleOrdinal(d3.schemePaired);
  }

  update(updatedCountryData, timePerYear) {
    var t = d3.transition().duration(timePerYear);
  
    //yScale.domain([0, d3.max(updatedCountryData, d => d.life_exp)]);
    this.yScale.domain([0, 100]);
  
    this.rScale.domain(d3.extent(updatedCountryData, (d: any) => d.population));
  
    // get the existing circles and join data
    var circles = this.chart.selectAll('circle')
      .data(updatedCountryData, d => d.country);
  
    // remove circle elements that do not have an associated data point
    circles.exit().remove();
  
    // update the Update selection
    circles
      .transition(t)
      .attr('cx', d => this.xScale(d.income))
      .attr('cy', d => this.yScale(d.life_exp))
      .attr('r', d => this.rScale(d.population))
      .attr('fill', d => this.ordScale(d.continent))
  
  
    // add new entries
    circles.enter().append('circle')
      .transition(t)
      .attr('cx', d => this.xScale(d.income))
      .attr('cy', d => this.yScale(d.life_exp))
      .attr('r', d => this.rScale(d.population))
      .attr('fill', d => this.ordScale(d.continent))
      
    circles.on('mouseover', this.handleMouseOver)
      .on('mouseleave', this.handleMouseExit);
      this.xAxisGroup.call(d3.axisBottom(this.xScale).tickValues([400, 4000, 40000]).tickFormat(d3.format("$")));
      this.yAxisGroup.call(d3.axisLeft(this.yScale));

    circles.attr('pointer-events', 'none');
  
  }

  formatData(yearData) {
    let countryData = yearData.countries;
    let currentYear = yearData.year;
    this.titleLabel.text(`${currentYear}`);
    
    // prepare the data
    var updatedCountryData = [];
    countryData.forEach(d => {
      if (d.income && 
        d.population && 
        d.life_exp &&
        d.continent) {
        d.income = +d.income;
        d.population = +d.population;
        d.life_exp = +d.life_exp;
        updatedCountryData.push(d);
      }
    });
    return updatedCountryData;
  }


  handleMouseOver(d, i, n) {
  

  }
  
  handleMouseExit(d, i, n) {

  }

}
