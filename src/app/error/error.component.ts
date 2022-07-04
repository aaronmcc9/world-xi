import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  @Input('message') message: string = '';
  @Output('messageChange') messageChange: EventEmitter<string> = new EventEmitter<string>(); 
  
  constructor() { }

  ngOnInit(): void {
  }

  clearError(){
    this.message = '';
    this.messageChange.emit(this.message);
  }


}
