import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  friendsActive: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  onTabClick(event: MatTabChangeEvent){
    this.friendsActive = event.index === 1;
  }
}
