import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ColumnService } from '../columns.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit, OnDestroy {

  cols: number = 2;
  isFixed = true;
  constructor(private columnService: ColumnService) { }

  resizeObservable: Observable<Event> = new Observable();
  resizeSubscription: Subscription = new Subscription();



  ngOnInit(): void {
    let colObs = this.columnService.columnObs;
    this.isFixed = window.innerHeight > 650;

    if (colObs) {
      colObs.subscribe((cols) => {
        this.cols = cols;
        console.log(this.cols);

      });
    }

    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe(evt => {
      this.isFixed = window.innerHeight > 650;
    })
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }
}
