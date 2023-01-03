import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PositionService } from '../players/position.service';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, pairwise, Subscription, take } from 'rxjs';
import { TeamService } from './team.service';
import { PlayersApiService } from '../api/players/players-api.service';
import { Player } from '../players/player.model';
import { AlertType } from '../alert/alert-type.enum';
import { Team } from './team.model';
import { cloneDeep } from 'lodash';
import { AlertService } from '../alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ColumnService } from '../columns.service';
import { ServiceResponse } from '../service-response.model';
import { Position } from '../players/player-position';
import { PlayerService } from '../players/player.service';
import { TeamApiService } from '../api/team/team-api.service';
import { FormationApiService } from '../api/team/formation/formation-api.service';
import { Formation } from '../api/team/formation/formation.model';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, AfterViewInit, OnDestroy {

  form = new FormGroup({
    teamName: new FormControl<string>(''),
    formation: new FormControl<number>(0)
  });

  formationsList: Formation[] = [];
  positions: number[] = [];

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

  constructor(public positionService: PositionService,
    private teamApiService: TeamApiService,
    public teamService: TeamService, private formationApiService: FormationApiService,
    private alertService: AlertService, private translateService: TranslateService,
    private columnService: ColumnService,
    private playerService: PlayerService) { }

  //#hooks
  async ngOnInit(): Promise<void> {

    await this.setFormationList();

    this.pageSubscription = this.teamService.page.subscribe((page) => {
      this.playersPage = page;
    })

    //deals with players list - will change
    this.playerSubscription = this.playerService.players
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
    // this.isLoading = true;
    // this.teamService.fetchUserTeam().subscribe({
    //   next: (res: ServiceResponse<Team>) => {
    //     if (res.data) {
    //       this.form.controls['teamName'].setValue(res.data.teamName, { onlySelf: true });
    //       this.setFormation(res.data['formation']);
    //       this.playerCount = res.data['players'].length;
    //     }

    //     this.isLoading = false;
    //     this.canSave = false;
    //   },
    //   error: (errorMessage: string) => {
    //     console.log(errorMessage);

    //     this.alertService.toggleAlert('ALERT_TEAM_FETCH_FAILURE', AlertType.Danger, errorMessage)
    //     this.isLoading = false;

    //   }
    // });

    await this.fetchPlayerTeam()

    if (this.playerCount === 0)
      this.playerCount = this.playerService.players.getValue().length;

    this.playerModificationSubscription = this.teamService.playerToModify.subscribe((player) => {
      this.playerToModify = player;
    })

    this.positions = this.positionService.fetchPositionValues();

    this.form?.get('formation')
      ?.valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]: [number | null, number | null]) => {

        try {
          if (next) {
            let structure = this.formationsList.find((f: Formation) => f.id == next)?.structure

            if (structure) {
              let defence = this.populatePlayerArray(this.teamService.teamDefence.getValue(), +structure![0]);
              let midfield = this.populatePlayerArray(this.teamService.teamMidfield.getValue(), +structure![1]);
              let forwards = this.populatePlayerArray(this.teamService.teamForward.getValue(), +structure![2]);

              // assign values after incase of formation error
              this.teamService.teamDefence.next(defence);
              this.teamService.teamMidfield.next(midfield);
              this.teamService.teamForward.next(forwards);
            }
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
    // this.setFormation(this.formationsList[3]);
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
    console.log(value);
    this.positionService.teamListPosition.next(+value);
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

    this.maxPage = !currentPosition ? this.playerCount / 16 :
      this.playerService.getPlayerCountByPosition(currentPosition) / 16;

    this.checkPageRight();
  }

  private checkPageRight() {
    this.canPageRight = this.maxPage <= this.playersPage;
  }

  private setFormation(formationId: number) {
    //let formationValue = this.formationsList.find((f: Formation) => f.id === formationId)?.structure
    this.form.controls['formation'].setValue(formationId, { onlySelf: true });
    console.log("form", this.form);
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
    this.positionService.teamListPosition.next(null);
  }

  async save() {

    if (!this.form.valid) {
      this.form.markAsDirty();
      return;
    }

    let team = this.getDto();

    if (!team)
      return;

      console.log(team)

    await this.modifyTeam(team)

    // this.isLoading = true;
    // teamAction.subscribe({
    //   next: () => {
    //     this.isLoading = false;
    //     this.canSave = false;
    //     this.canCancel = false;
    //     this.alertService.toggleAlert("ALERT_TEAM_UPDATED", AlertType.Success);
    //   },
    //   error: (errorMessage: string) => {
    //     this.error = errorMessage;
    //     this.isLoading = false;
    //   } 
    // });
  }

  toggleRevertModal(action: string) {
    //if reset is clicked a 3 character formation string will be emitted
    //set it to empty after resetting the formation to close the modal
    if (action && action.length === 1) {
      this.setFormation(+action);
      this.canSave = true;
      action = '';
    }

    this.revertAction = action;
  }

  private async fetchPlayerTeam() {
    this.isLoading = true;

    try {
      const result = await lastValueFrom(this.teamApiService.fetchUserTeam());
      this.isLoading = false;

      if (result.success) {
        if (result.data.id > 0) {
          this.teamService.savedTeam = cloneDeep(result.data);
          this.teamService.setPlayersByPosition(result.data.players);
          this.form.controls['teamName'].setValue(result.data.teamName, { onlySelf: true });
          this.setFormation(result.data['formation'].id);
          // this.playerCount = res.data['players'].length;
        }
        else {
          //no saved user team
          let defaultFormation = this.teamService.getDefaultFormation()
          console.log("HERE", result.data, defaultFormation);

          this.setFormation(defaultFormation);
        }

        this.canSave = false;
      }
      else {
        this.alertService.toggleAlert('ALERT_TEAM_FETCH_FAILURE', AlertType.Danger)
      }
    }
    catch (e) {
      this.alertService.toggleAlert('ALERT_TEAM_FETCH_FAILURE', AlertType.Danger)
      this.isLoading = false;
    }
  }

  private async setFormationList() {
    this.isLoading = true;
    this.formationsList = await this.teamService.fetchFormationList();
    this.isLoading = false;
  }

  private async modifyTeam(team: Team) {
    this.isLoading = true;

    try {
      const result = team.id > 0 ?
        await lastValueFrom(this.teamApiService.updateTeam(team)) :
        await lastValueFrom(this.teamApiService.createTeam(team));

      if (result.data) {
        this.teamService.savedTeam = result.data;
        this.canSave = false;
        this.teamService.canCancelChanges = false;
        this.alertService.toggleAlert("ALERT_TEAM_UPDATED", AlertType.Success);
      }
      else {
        this.alertService.toggleAlert('ALERT_TEAM_UPDATE_FAILURE', AlertType.Danger);
      }

      this.isLoading = false;
    }
    catch (e) {
      this.isLoading = false;
      this.alertService.toggleAlert('ALERT_TEAM_UPDATE_FAILURE', AlertType.Danger);
    }

  }

  private checkMaximumPlayersSelected(team: (Player | undefined)[]) {
    let playersFull = team.every((player) => {
      return player != undefined;
    });

    this.playersSelected = 11;
    return playersFull && this.playersSelected === 11
  }

  private getDto(): Team {
    let formValue = this.form.getRawValue();
    let players: (Player | undefined)[] = <(Player | undefined)[]>[...this.goalkeeper, ...this.defence, ...this.midfield, ...this.forwards];

    if (!this.checkMaximumPlayersSelected(players)) {
      this.alertService.toggleAlert('ALERT_ELEVEN_PLAYERS_TO_SAVE', AlertType.Danger);
      throw Error("Invalid Operation");
    }

    return {
      id: this.teamService.savedTeam.id,
      teamName: formValue.teamName,
      formation: this.formationsList.find((f: Formation) => f.id == formValue.formation),
      players: players
    } as Team;
  }

}
