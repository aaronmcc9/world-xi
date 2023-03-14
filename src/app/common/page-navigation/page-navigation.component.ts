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

  @Output() pageChanged = new EventEmitter<boolean>();

  constructor() { }

  ngOnChanges(): void {

  }

  onPageLeft() {
    if (this.page > 1) {
      this.page--;
      this.pageChanged.emit(false);
    }
  }

  onPageRight() {
    this.page++;
    this.pageChanged.emit(true);
  }

}
