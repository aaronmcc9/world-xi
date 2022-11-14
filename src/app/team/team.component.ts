import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { PositionService } from '../players/position.service';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { pairwise, Subscription, take } from 'rxjs';
import { TeamService } from './team.service';
import { PlayersService } from '../players/players.service';
import { Player } from '../players/player.model';
import { AlertType } from '../alert/alert-type.enum';
import { Team } from './team.model';
import { cloneDeep } from 'lodash';
import { AlertService } from '../alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ColumnService } from '../columns.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, AfterViewInit, OnDestroy {

  form = new FormGroup({
    formation: new FormControl<string>('442')
  });

  formationsList: string[] = [];
  positions: string[] = [];

  error: string = '';
  isLoading = false;

  //formation values
  goalkeeper: (Player | undefined)[] = new Array<Player>(1);
  defence: (Player | undefined)[] = new Array<Player>(4);
  midfield: (Player | undefined)[] = new Array<Player>(4);
  forwards: (Player | undefined)[] = new Array<Player>(2);

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

  //Cancel/ Reset
  revertAction = '';
  canCancel = false;

  //subscriptions  
  pageSubscription = new Subscription();
  playerSubscription = new Subscription();
  playerModificationSubscription = new Subscription();

  goalkeeperSubscription = new Subscription();
  defenceSubscription = new Subscription();
  midfieldSubscription = new Subscription();
  forwardsSubscription = new Subscription();

  //screen information
  cols: number = 3;
  pitchColspan: number = 2;
  belowMediumSize = false;

  constructor(private positionService: PositionService,
    private teamService: TeamService, private playersService: PlayersService,
    private alertService: AlertService, private translateService: TranslateService,
    private columnService: ColumnService) { }

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

    let colObs = this.columnService.columnObs;

    if (colObs) {
      colObs.subscribe((cols) => {

        this.cols = cols > 1 ? cols + 1 : cols;
        this.pitchColspan = cols;

      });
    }

    //tracks current screen size
    this.columnService.screenSize.subscribe((screenSize) => {
      this.belowMediumSize = screenSize == 'sm' || screenSize == 'xs';
    });

    this.goalkeeperSubscription = this.teamService.teamGoalkeeper.subscribe((goalkeeper) => {
      let newValue = cloneDeep(goalkeeper);

      this.setCanSave(newValue.filter(Boolean).length - this.goalkeeper.filter(Boolean).length);
      this.goalkeeper = newValue;
    });

    this.defenceSubscription = this.teamService.teamDefence.subscribe((defence) => {
      let newValue = cloneDeep(defence);

      this.setCanSave(newValue.filter(Boolean).length - this.defence.filter(Boolean).length);
      this.defence = newValue;
    });

    this.midfieldSubscription = this.teamService.teamMidfield.subscribe((midfield) => {
      let newValue = cloneDeep(midfield);

      this.setCanSave(newValue.filter(Boolean).length - this.midfield.filter(Boolean).length);
      this.midfield = newValue;
    });

    this.forwardsSubscription = this.teamService.teamForward.subscribe((forwards) => {
      let newValue = cloneDeep(forwards);

      this.setCanSave(newValue.filter(Boolean).length - this.forwards.filter(Boolean).length);
      this.forwards = newValue;
    });
    this.isLoading = true;
    this.teamService.fetchUserTeam().subscribe({
      next: (res: Team) => {
        if (res) {
          if (res['formation']) {
            this.setFormation(res['formation']);
          }
          if (res['players']) {
            this.playerCount = res['players'].length;
          }
        }

        this.isLoading = false;
        this.canSave = false;
      },
      error: (errorMessage: string) => {
        console.log(errorMessage);

        this.alertService.toggleAlert('ALERT_TEAM_FETCH_FAILURE', AlertType.Danger, errorMessage)
        this.isLoading = false;

      }
    });

    if (this.playerCount === 0)
      this.playerCount = this.playersService.players.length;

    this.playerModificationSubscription = this.teamService.playerToModify.subscribe((player) => {
      this.playerToModify = player;
      this.canCancel = this.teamService.canCancelChanges;
    })

    this.formationsList = ['343', '352', '342', '442', '433', '451', '532', '541', '523'];
    this.positions = this.positionService.fetchPositions();

    this.form?.get('formation')
      ?.valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]: [string | null, string | null]) => {

        try {
          if (next) {
            let defence = this.populatePlayerArray(this.teamService.teamDefence.getValue(), +next![0]);
            let midfield = this.populatePlayerArray(this.teamService.teamMidfield.getValue(), +next![1]);
            let forwards = this.populatePlayerArray(this.teamService.teamForward.getValue(), +next![2]);

            // assign values after incase of formation error
            this.teamService.teamDefence.next(defence);
            this.teamService.teamMidfield.next(midfield);
            this.teamService.teamForward.next(forwards);
          }
        }
        catch {
          //reset incase formation change forbidden
          if (prev)
            this.setFormation(prev);
        }
      });
  }

  ngAfterViewInit(): void {
    //set default formation to 442
    this.setFormation(this.formationsList[3]);
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

  private checkPageRight() {
    this.canPageRight = this.maxPage <= this.playersPage;
  }

  private setFormation(formation: string) {
    this.form.controls['formation'].setValue(formation, { onlySelf: true });
  }


  private populatePlayerArray(existingPlayers: (Player | undefined)[], formationValue: number) {
    //remove empties
    let existingPlayersLength = existingPlayers.filter(Boolean).length

    //players match existing formation cpunt for that position - return
    if (existingPlayersLength === formationValue) {
      return existingPlayers.filter(Boolean);
    }

    //new empty array with new desired value
    let players = new Array<Player>(formationValue);
    //how much players can we fill / how much to be undefined
    let indexesToFill = (formationValue - existingPlayersLength) - 1;

    if (indexesToFill < 0) {
      this.alertService.toggleAlert('ALERT_TOO_MANY_PLAYERS', AlertType.Danger);
      throw new Error(this.translateService.instant('EXCEPTION_PLAYER_OUT_OF_POSITION'));
    }

    //add the existing players into the array, the rest will fill as undefined
    existingPlayers.forEach((player) => {
      players.splice(indexesToFill, 1, player!);
      indexesToFill--;
    })

    return players;
  }

  private setCanSave(positionAmount: number) {
    this.playersSelected = this.playersSelected + positionAmount;
    this.canSave = this.playersSelected === 11;
  }

  // Resets values
  private Reset() {
    this.canPageRight = false;
    this.maxPage = 1;
    this.playersPage = 1;
    this.form?.reset();

    this.teamService.page.next(1);
    this.positionService.teamListPosition.next('');
  }

  save() {
    let players: (Player | undefined)[] = <(Player | undefined)[]>[...this.goalkeeper, ...this.defence, ...this.midfield, ...this.forwards];
    if (!this.checkMaximumPlayersSelected(players)) {
      this.alertService.toggleAlert('ALERT_ELEVEN_PLAYERS_TO_SAVE', AlertType.Danger);
      return;
    }

    let formation = this.form.controls['formation'].value;
    let team = new Team(<Player[]>players, formation!)

    this.isLoading = true;
    this.teamService.saveUserTeam(team)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.canSave = false;
          this.canCancel = false;
          this.alertService.toggleAlert("ALERT_TEAM_UPDATED", AlertType.Success);
        },
        error: (errorMessage: string) => {
          this.error = errorMessage;
          this.isLoading = false;
        }
      });
  }

  toggleRevertModal(action: string) {
    //if reset is clicked a 3 character formation string will be emitted
    //set it to empty after resetting the formation to close the modal
    if (action && action.length === 3) {
      this.setFormation(action);
      this.canSave = true;
      action = '';
    }

    //in the event this value has been altered change it
    this.canCancel = this.teamService.canCancelChanges;
    this.revertAction = action;
  }



  private checkMaximumPlayersSelected(team: (Player | undefined)[]) {
    let playersFull = team.every((player) => {
      return player != undefined;
    });

    this.playersSelected = 11;
    return playersFull && this.playersSelected === 11
  }


}
