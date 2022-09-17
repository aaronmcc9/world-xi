import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PositionService } from '../players/position.service';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription, take } from 'rxjs';
import { TeamService } from './team.service';
import { PlayersService } from '../players/players.service';
import { Player } from '../players/player.model';
import { Position } from '../players/player-position';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, AfterViewInit, OnDestroy {

  form = new FormGroup({});
  formationsList: string[] = [];
  positions: string[] = [];

  error: string = '';

  //formation values
  goalkeeper: Player[] = new Array<Player>(1);
  defence: Player[] = new Array<Player>(4);
  midfield: Player[] = new Array<Player>(4);
  forwards: Player[] = new Array<Player>(2);

  // defenceCount: number = 4;
  // midfieldCount: number = 4;
  // forwardCount: number = 2;
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

  goalkeeperSubscription = new Subscription()
  defenceSubscription = new Subscription()
  midfieldSubscription = new Subscription()
  forwardsSubscription = new Subscription()

  constructor(private positionService: PositionService,
    private teamService: TeamService, private playersService: PlayersService) { }

  //#hooks
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

    this.goalkeeperSubscription = this.teamService.teamGoalkeeper.subscribe((goalkeeper) => {
      this.goalkeeper = goalkeeper;
    });

    this.defenceSubscription = this.teamService.teamDefence.subscribe((defence) => {
      this.defence = defence;
    });

    this.midfieldSubscription = this.teamService.teamMidfield.subscribe((midfield) => {
      this.midfield = midfield;
    });

    this.forwardsSubscription = this.teamService.teamForward.subscribe((forwards) => {
      this.forwards = forwards;
    });

    if (this.playerCount === 0)
      this.playerCount = this.playersService.players.length;

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
    this.Reset();

    this.pageSubscription.unsubscribe();
    this.playerSubscription.unsubscribe();
    this.playerModificationSubscription.unsubscribe();
    this.goalkeeperSubscription.unsubscribe();
    this.defenceSubscription.unsubscribe();
    this.midfieldSubscription.unsubscribe();
    this.forwardsSubscription.unsubscribe();
  }

  onFormationChange() {
    let formation = this.form.controls['formation'].value;

    if (formation != null && formation.length === 3) {

      let goalkeeper = this.teamService.teamGoalkeeper.getValue();
      if (goalkeeper) {
        this.goalkeeper = goalkeeper;
      }

      this.defence = this.populatePlayerArray(this.teamService.teamDefence.getValue(), +formation[0]);
      this.midfield = this.populatePlayerArray(this.teamService.teamMidfield.getValue(), +formation[1]);
      this.forwards = this.populatePlayerArray(this.teamService.teamForward.getValue(), +formation[2]);
    }
  }

  onFilterPlayerList(value: string) {
    this.positionService.teamListPosition.next(value);
    this.teamService.page.next(1); //reset page

    this.setMaxPage();
  }

  onPageLeft() {
    if (this.playersPage > 1) {
      this.teamService.page.next(this.playersPage - 1);
      this.checkPageRight()
    }
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


  private populatePlayerArray(existingPlayers: Player[], formationValue: number) {
    if (existingPlayers.length === formationValue)
      return existingPlayers;

    let players = new Array<Player>(formationValue);
    let indexesToFill = (formationValue - existingPlayers.length) - 1;

    existingPlayers.forEach((player) => {
      players.splice(indexesToFill, 1, player);
      indexesToFill--;
    })

    return players;
  }

  // Resets values
  private Reset() {
    this.canPageRight = false;
    this.maxPage = 1;
    this.playersPage = 1;
    this.form.reset();

    this.teamService.page.next(1);
    this.positionService.teamListPosition.next('');
  }
}
