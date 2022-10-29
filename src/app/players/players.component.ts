import { Component, OnInit } from '@angular/core';
import { ColumnService } from '../columns.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  cols: number = 2;
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
