import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PositionService } from '../players/position.service';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, AfterViewInit {

  form = new FormGroup({});
  formationsList: string[] = [];
  positions: string[] = [];

  //formation values
  defenceCount: number = 4;
  midfieldCount: number = 4;
  forwardCount: number = 2;

  //icons
  leftNav = faArrowLeft;
  rightNav = faArrowRight;

  playerPositionFilter = '';
  teamListPage = 1;


  constructor(private positionService: PositionService) { }

  ngOnInit(): void {

    this.formationsList = ['343', '352', '342', '442', '433', '451', '532', '541', '523']
    this.positions = this.positionService.fetchPositions();

    this.form = new FormGroup({
      formation: new FormControl()
    });
  }

  ngAfterViewInit(): void {
    this.form.controls['formation'].setValue(this.formationsList[3], { onlySelf: true });
  }

  onFormationChange() {
    let formation = this.form.controls['formation'].value;

    if (formation != null && formation.length === 3) {
      this.defenceCount = +formation[0];
      this.midfieldCount = +formation[1];
      this.forwardCount = +formation[2];
    }
  }

  onFilterPlayerList(value: string) {
    this.positionService.teamListPosition.next(value);
  }

  onPageLeft() {
    if (this.teamListPage > 1)
      this.teamListPage--;
  }

  onPageRight() {
    this.teamListPage++;
  }

}
