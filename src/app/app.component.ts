import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth/auth.service';
import { MediaObserver} from '@angular/flex-layout';
import { ColumnService } from './columns.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public authService: AuthService, public mediaObserver: MediaObserver,
    private columnService: ColumnService) { }

  ngOnInit(): void {
    this.columnService.setColumns();
 }
}
