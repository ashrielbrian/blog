import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as d3 from 'd3';

interface Action {

}

@Injectable({
    providedIn: 'root'
})

export class SortingSerivce {
    constructor() {}

    arrLength: number = 100;
    array: number[];
    
    _actionsChanges$: Subject<any[]> = new Subject<any[]>();
    _arrayChanges$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(this.generateRandomisedArray(this.arrLength));

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

    callMergeSort() {
        let arr = [... this._arrayChanges$.getValue()];
        let actions = [];
        
        var mergeSort = (arr: number[]) => {
            if (arr.length <= 1) return arr;

            let mid = Math.floor(arr.length / 2);
            let left = mergeSort(arr.slice(0, mid));
            let right = mergeSort(arr.slice(mid));


            return merge(left, right);
        }

        var merge = (arrA: number[], arrB: number[]) => {
            // arrA & arrB are both ordered arrays
            let merged = [];
            while (arrA.length !== 0 && arrB.length !== 0) {
                if (arrA[0] < arrB[0]) merged.push(arrA.shift());
                else merged.push(arrB.shift());
            }
         
            return arrA.length !== 0 ? merged.concat(arrA) : merged.concat(arrB);
        }
        let sorted =  mergeSort(arr);
        
    }
}

