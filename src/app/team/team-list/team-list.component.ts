import { Component, OnInit } from '@angular/core';
import { Position } from 'src/app/players/player-position';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  positions: string[] = [];


  constructor() { }

  ngOnInit(): void {
    this.positions = <string[]>Object.values(Position)
      .filter(p => {
        return typeof p === typeof 'string';
      })
    console.log(this.positions);
  }

}
