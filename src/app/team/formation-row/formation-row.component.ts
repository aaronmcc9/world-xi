import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-formation-row',
  templateUrl: './formation-row.component.html',
  styleUrls: ['./formation-row.component.css']
})
export class FormationRowComponent implements OnInit, OnChanges {

  //the number of selections available for the position - e.g 3 midfielders
  @Input('playerCount') playerCount = 1;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("Hello", changes['playerCount'].currentValue);
}

}
