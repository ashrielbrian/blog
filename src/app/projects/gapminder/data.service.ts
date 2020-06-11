
import * as d3 from 'd3';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export class CountryData {
    constructor(
        public continent: string,
        public country: string,
        public income: number,
        public lifeExpectancy: number,
        public population: number,
    ) {}
}

export class YearData {
    constructor(
        public countriesData: CountryData[],
        public year: string,
    ) {}
}

export enum Continent {
    All = 'All',
    Americas = "Americas",
    Europe = 'Europe',
    Asia = "Asia",
    Africa = "Africa",
}


@Injectable({
    providedIn: 'root',
})

export class DataService {
    constructor(){}
    /**
    *   Controls and tracks the current state of the dataset and UI.
    *   TODO: Use _isLoading$ to show up a spinner while loading up the JSON file
    */
    private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private isAnimating: boolean = false; // tracks the state of the chart, whether it is currently in transition
    private isAnimating$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isAnimating);
    private time: number = 0;           // tracks the current year of the dataset, in terms of index
    private continent: Continent = Continent.All;      // tracks the current continent to be shown
    private currentYearData: YearData;     // tracks the current year's data
    private currentYearData$: BehaviorSubject<YearData> = new BehaviorSubject<YearData>(null);
    private data: YearData[];   // the entire dataset
    private data$: BehaviorSubject<YearData[]> = new BehaviorSubject<YearData[]>(null);
    private dataLength: number; // the number of years in the dataset
    public get continents(): Continent[] { return [Continent.All, Continent.Europe, Continent.Asia, Continent.Americas, Continent.Africa] };

    public getLoading$(): Observable<boolean> {
        return this._isLoading$.asObservable();
    }
    public getIsAnimating$(): Observable<boolean> {
        return this.isAnimating$.asObservable();
    }

    public updateIsAnimating(updatedStatus: boolean) {
        this.isAnimating = updatedStatus;
        this.isAnimating$.next(this.isAnimating);
    }

    public getYearData$(): Observable<YearData> {
        return this.currentYearData$.asObservable();
    }

    private _broadcastYearData() {
        // notifies all listeners that there is a new set of YearData
        this.currentYearData = this.data[this.time];
        let filteredCountriesData = this._filter(this.currentYearData.countriesData);   
        this.currentYearData$.next(new YearData(filteredCountriesData, this.currentYearData.year));
    }

    public updateContinent(selected: Continent) {
        this.continent = selected;
        this._broadcastYearData();
    }

    public updateTime(year: number) {
        this.time = year - 1800;
        this._broadcastYearData();
    }
    
    public reset() {
        this.time = 0;
        this.currentYearData = this.data[0];
        this.currentYearData$.next(this.currentYearData);
    }

    public step(): void {
        // increments to the next year, and updates the yearData
        if (this.data) {
            this.time = (this.time < this.dataLength - 1) ? this.time + 1 : 0;
            this._broadcastYearData();
        }
    }

    public async loadGapminderData() {
        /**
         * Gets the gapminder data.
         */

        let fetched: any[] = await d3.json('https://raw.githubusercontent.com/adamjanes/udemy-d3/master/05/5.10.0/data/data.json');
    
    
        this.data = fetched.map(yearData => {
            let countriesData = this._formatData(yearData);
            this._isLoading$.next(false);
            return new YearData(countriesData, yearData.year);
        });
        this.dataLength = fetched.length;
        // initialise the first set of data
        this.currentYearData = this.data[this.time];
        this.currentYearData$.next(this.currentYearData);
        this.data$.next(this.data);
        
    }

    private _formatData(yearData) {
        // formats the data and do minor cleaning
        let updatedCountryData = [];
        yearData.countries.forEach(d => {
            if (d.income && d.population && d.life_exp &&d.continent) {
                updatedCountryData.push(
                     new CountryData(this._capitalise(d.continent), d.country, +d.income, +d.life_exp, +d.population)
                );
            }
        });
        return updatedCountryData;
    }

    private _filter(countriesData: CountryData[]) {
        // filters out the countries by continent
        let filteredCountriesData = countriesData.filter(d => {
            if (this.continent == 'All') {return true }
            else {return d.continent == this.continent};
        });

        return filteredCountriesData;
    }

    private _capitalise(s: string): string {
        return s[0].toUpperCase() + s.slice(1);
    }
}