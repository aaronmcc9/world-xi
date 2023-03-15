import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-navigation',
  templateUrl: './page-navigation.component.html',
  styleUrls: ['./page-navigation.component.css']
})
export class PageNavigationComponent implements OnChanges {

  //icons
  leftNav = faArrowLeft;
  rightNav = faArrowRight;

  @Input() page = 1;
  @Input() canPageRight = false;
  @Input() totalItems = 0;
  @Input() pageItems = 0;


  @Output() pageChanged = new EventEmitter<number>();

  constructor() { }

  ngOnChanges(): void {

  }

  onPageLeft() {
    if (this.page > 1) {
      this.page--;
      this.pageChanged.emit(this.page);
    }
  }

  onPageRight() {
    this.page++;
    this.pageChanged.emit(this.page);
  }

}
