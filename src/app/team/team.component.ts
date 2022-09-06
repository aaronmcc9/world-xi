import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PositionService } from '../players/position.service';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription, take } from 'rxjs';
import { TeamService } from './team.service';
import { PlayersService } from '../players/players.service';
import { Player } from '../players/player.model';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, AfterViewInit, OnDestroy {

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

  //page information
  maxPage: number = 1
  canPageRight: boolean = false;  
  playersPage: number = 1;
  playerCount: number = 0;

  //team information
  playersSelected: number = 0;
  playerToModify: Player | null = null;
  canSave: boolean = false;

  //subscriptions  
  pageSubscription = new Subscription();
  playerSubscription = new Subscription();
  playerModificationSubscription = new Subscription();


  constructor(private positionService: PositionService,
    private teamService: TeamService, private playersService: PlayersService) { }

  ngOnInit(): void {

    this.pageSubscription = this.teamService.page.subscribe((page) => {
      this.playersPage = page;
    })

    this.playerSubscription = this.playersService.playersChanged
      .pipe((take(1)))
      .subscribe((players: Player[]) => {

        this.playerCount = players.length;
        this.setMaxPage();
      });

    this.playerModificationSubscription = this.teamService.playerToModify.subscribe((player) => {
      this.playerToModify = player;
    })


    this.formationsList = ['343', '352', '342', '442', '433', '451', '532', '541', '523'];
    this.positions = this.positionService.fetchPositions();

    this.form = new FormGroup({
      formation: new FormControl(''),
      startingPlayersIds: new FormControl(null, [Validators.maxLength(11), Validators.minLength(11)])
    });
  }

  ngAfterViewInit(): void {
    //set default formation to 442
    this.form.controls['formation'].setValue(this.formationsList[3], { onlySelf: true });
  }

  ngOnDestroy(): void {
    this.pageSubscription.unsubscribe();
    this.playerSubscription.unsubscribe();
    this.playerModificationSubscription.unsubscribe();
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
    this.teamService.page.next(1); //reset page

    this.setMaxPage(); 1
  }

  onPageLeft() {
    if (this.playersPage > 1)
      this.teamService.page.next(this.playersPage - 1);
  }

  onPageRight() {
    this.teamService.page.next(this.playersPage + 1);
    this.checkPageRight();
  }

  setMaxPage() {
    let currentPosition = this.positionService.teamListPosition.getValue();

    this.maxPage = currentPosition === '' ? this.playerCount / 16 :
      this.playersService.getPlayerCountByPosition(currentPosition) / 16;

    this.checkPageRight();
  }

  checkPageRight() {
    this.canPageRight = this.maxPage <= this.playersPage;
  }
}
