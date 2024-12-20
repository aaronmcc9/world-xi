import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PositionService } from '../players/position.service';
import { lastValueFrom, pairwise, Subscription, throwError } from 'rxjs';
import { TeamService } from './team.service';
import { Player } from '../players/player.model';
import { AlertType } from '../alert/alert-type.enum';
import { cloneDeep } from 'lodash';
import { AlertService } from '../alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ColumnService } from '../columns.service';
import { TeamApiService } from '../api/team/team-api.service';
import { Formation } from '../api/team/formation/formation.model';
import { ModifyTeamDto } from '../api/team/modify-team.dto';
import { ActivatedRoute } from '@angular/router';
import { RevertTeamOptions } from './revert-team/revert-team.component';

interface FormValue {
    formation: FormControl<number>,
}

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, OnDestroy {

    form!: FormGroup<FormValue>;
    viewMode = true;
    teamId?: number;

    formationsList: Formation[] = [];
    positions: number[] = [];

    error: string = '';
    isLoading = false;

    //formation values
    goalkeeper: (Player | undefined)[] = new Array<Player>(1);
    defence: (Player | undefined)[] = new Array<Player>(4);
    midfield: (Player | undefined)[] = new Array<Player>(4);
    forwards: (Player | undefined)[] = new Array<Player>(2);

    //team information
    playersSelected: number = 0;
    playerToModify: Player | null = null;
    canSave: boolean = false;

    //Cancel/ Reset
    revertAction = '';

    //subscriptions  
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
        public teamService: TeamService,
        private alertService: AlertService,
        private translateService: TranslateService,
        private columnService: ColumnService,
        private route: ActivatedRoute) { }

    //#hooks
    async ngOnInit(): Promise<void> {
        await this.setFormationList();

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

        this.playerModificationSubscription = this.teamService.playerToModify.subscribe((player) => {
            this.playerToModify = player;
        })

        let isInit = true;
        this.route.params.subscribe((params) => {
            let id = +params['id'];
            this.teamId = id;

            let viewMode = id > 0;
            if (this.viewMode != viewMode && !isInit)
                this.reset();
        })

        this.positions = this.positionService.fetchPositionValues();
        isInit = false;
        await this.reset()
    }

    ngOnDestroy(): void {
        this.playerSubscription.unsubscribe();
        this.playerModificationSubscription.unsubscribe();
        this.goalkeeperSubscription.unsubscribe();
        this.defenceSubscription.unsubscribe();
        this.midfieldSubscription.unsubscribe();
        this.forwardsSubscription.unsubscribe();
    }

    private setFormation(formationId: number, emitEvent = true) {
        this.form.controls['formation'].setValue(formationId, { onlySelf: true, emitEvent: emitEvent });
    }


    private populatePlayerArray(existingPlayers: (Player | undefined)[], formationValue: number) {
        //remove empties
        let existingPlayersLength = existingPlayers.filter(Boolean).length

        //players match existing formation count for that position - return
        if (existingPlayersLength === formationValue)
            return existingPlayers.filter(Boolean);

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
    private async reset() {
        this.viewMode = this.teamId ?
            true : false;

        if (!this.viewMode) {
            this.form?.reset();
        }

        let formationControl = new FormControl<number>(0,
            {
                nonNullable: true,
                validators: [Validators.required]
            });

        formationControl.valueChanges
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

                            this.teamService.canCancelChanges = true;
                        }
                    }
                }
                catch {
                    //reset incase formation change forbidden
                    if (prev) {
                        this.setFormation(prev, false);
                    }
                }
            });

        this.form = new FormGroup<FormValue>({
            formation: formationControl
        })

        //These subscriptions refer to the players fielded on a team per position
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

        await this.fetchPlayerTeam()
    }

    async save() {

        if (!this.form.valid) {
            this.form.markAsDirty();
            return;
        }

        let team = this.getDto();

        if (!team)
            return;

        await this.modifyTeam(team);
    }

    toggleRevertModal(options: RevertTeamOptions) {
        //if reset is clicked a 3 character formation string will be emitted
        //set it to empty after resetting the formation to close the modal
        if (options.formation && options.formation != this.form.controls.formation.value) {
            this.setFormation(options.formation);
            // this.canSave = true;
        }

        this.revertAction = options.action;

    }

    private async fetchPlayerTeam() {
        this.isLoading = true;

        try {
            const result = await lastValueFrom(this.teamApiService.fetchUserTeam(this.teamId));
            this.isLoading = false;

            if (result.success) {
                if (result.data.id > 0) {

                    this.teamService.savedTeam.next(result.data);
                    this.teamService.setPlayersByPosition(result.data.players);
                    this.setFormation(result.data['formation'].id);
                }
                else {
                    //no saved user team
                    if (!this.form.controls['formation'].value) {
                        let defaultFormation = this.teamService.getDefaultFormation()
                        this.setFormation(defaultFormation.id);
                    }
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
        this.formationsList = await this.teamService
            .fetchFormationList();

        this.isLoading = false;
    }

    private async modifyTeam(team: ModifyTeamDto) {
        this.isLoading = true;
        try {
            const result = team.id > 0 ?
                await lastValueFrom(this.teamApiService.updateTeam(team)) :
                await lastValueFrom(this.teamApiService.createTeam(team));

            if (result.data) {
                this.teamService.savedTeam.next(result.data);
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
        return playersFull;
    }

    private getDto(): ModifyTeamDto {
        let formValue = this.form.getRawValue();
        let players: (Player | undefined)[] = <(Player | undefined)[]>[...this.goalkeeper, ...this.defence, ...this.midfield, ...this.forwards];

        if (!this.checkMaximumPlayersSelected(players)) {
            this.alertService.toggleAlert('ALERT_ELEVEN_PLAYERS_TO_SAVE', AlertType.Danger);
            throw Error("Invalid Operation");
        }

        return {
            id: this.teamService.savedTeam.getValue()?.id ?? 0,
            formationId: formValue.formation,
            playerIds: players.map((p: Player | undefined) => p!.id)
        } as ModifyTeamDto;
    }
}