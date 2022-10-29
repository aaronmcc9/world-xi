import { Injectable } from "@angular/core";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { distinctUntilChanged, map, Observable, Subscription } from "rxjs";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ColumnService {

    constructor(public mediaObserver: MediaObserver) { }

    columnObs: Observable<any> | undefined;
    screenSize = new Subject<string>();

    grid = new Map([
        ['xs', 1],
        ['sm', 1],
        ['md', 1],
        ['lg', 2],
        ['xl', 2],  
    ])

    setColumns() {
            this.columnObs = this.mediaObserver
            .asObservable()
            .pipe(map((change: MediaChange[]) => {
            
              this.screenSize.next(change[0].mqAlias);
              console.log(change[0].mqAlias);

              return this.grid.get(change[0].mqAlias);
            }));
        }
}