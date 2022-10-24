import { OnDestroy } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { ColumnService } from '../columns.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  cols: number = 2;
  // cols: Observable<any> | undefined;
  constructor(private columnService: ColumnService) { }

  ngOnInit(): void {
    let colObs = this.columnService.columnObs;

    if (colObs) {
      colObs.subscribe((cols) => {
        this.cols = cols;
        console.log(this.cols);

      });
    }
  }
}
