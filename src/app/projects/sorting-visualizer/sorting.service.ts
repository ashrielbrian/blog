import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, merge } from 'rxjs';
import * as d3 from 'd3';

@Injectable({
    providedIn: 'root'
})

export class SortingSerivce {
    constructor() {}

    arrLength: number = 200;
    array: number[];
    
    private _isAnimating$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _actionsChanges$: Subject<any[]> = new Subject<any[]>();
    private _arrayChanges$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(this.generateRandomisedArray(this.arrLength));

    startAnimation() {
        this._isAnimating$.next(true);
    }

    stopAnimation() {
        this._isAnimating$.next(false);
    }

    getAnimation$(): Observable<boolean> {
        return this._isAnimating$.asObservable();
    }

    getActions$(): Observable<any[]> {
        return this._actionsChanges$.asObservable();
    }
    getArray$(): Observable<number[]> {
        return this._arrayChanges$.asObservable();
    }

    private generateRandomisedArray(length: number) {
        return d3.shuffle(d3.range(this.arrLength));
    }

    callBubbleSort() {
        let arr: number[] = [... this._arrayChanges$.getValue()];
        let actions = [];

        for (let i = 0; i < arr.length; i++) {
            let swapped = false;
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // swap elements
                    
                    actions.push({
                        type: 'swap', i: j, j: j + 1
                    });

                    swapped = true;
                }
            }
            if (!swapped) break;
        }
        actions.push({type: 'done'});
        actions.reverse();
        this._actionsChanges$.next(actions);
    }

    callIterativeMergeSort() {
        /* 
            adapted from Mike Bostock: http://bl.ocks.org/mbostock/1243323
        */
        let array: number[] = [...this._arrayChanges$.getValue()];
        let actions = [], i, j, m = 1;
  
        // double the size each pass
        while (m < array.length) {
            i = 0, j = 0; 
            while (i < array.length) {
                j += merge(i, i += m, i += m)
            };
            if (j) {
                // each action tracks the current array snapshop after each merge of the arrays is made
                actions.push({
                    type: 'snapshot',
                    arr: array.slice()
                });
            } else m <<= 1;
        }
    
        // Merges two adjacent sorted arrays in-place.
        function merge(start, middle, end) {
            middle = Math.min(array.length, middle);
            end = Math.min(array.length, end);
            for (; start < middle; start++) {
                if (array[start] > array[middle]) {
                    var v = array[start];
                    array[start] = array[middle];
                    insert(middle, end, v);
                    return true;
                }
            }
                return false;
        }
    
        // Inserts the value v into the subarray specified by start and end.
        function insert(start, end, v) {
            while (start + 1 < end && array[start + 1] < v) {
                var tmp = array[start];
                array[start] = array[start + 1];
                array[start + 1] = tmp;
                start++;
            }
            array[start] = v;
        }
        actions.reverse();
        this._actionsChanges$.next(actions);

    }
}

