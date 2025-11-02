import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { ColumnService } from 'src/app/columns.service';
import { Position } from '../player-position';
import { PlayerDto } from '../player.dto';
import { PlayersApiService } from '../../api/players/players-api.service';
import { lastValueFrom } from 'rxjs';
import { PositionService } from '../position.service';
import { PlayerService } from '../player.service';
import { orderBy } from 'lodash';

interface FormValue {
    id: FormControl<number | null>;
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    age: FormControl<number | null>;
    position: FormControl<Position | null>;
    club: FormControl<string | null>;
    country: FormControl<string | null>;
    photoFile: FormControl<File | null>;
    photoUrl: FormControl<string | null>;
    photoBlobName: FormControl<string | null>;
    isSelected: FormControl<boolean>;
}

@Component({
    selector: 'app-modify-player',
    templateUrl: './modify-player.component.html',
    styleUrls: ['./modify-player.component.css']
})
export class ModifyPlayerComponent implements OnInit {
    editMode = false;
    positions: Position[] = [];

    id: number = 0;
    isLoading = false;
    error = '';
    form: FormGroup<FormValue> | null = null;
    cols: number = 2;

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    constructor(private playersApiService: PlayersApiService,
        private playerService: PlayerService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private columnService: ColumnService,
        public positionService: PositionService) { }

    async ngOnInit(): Promise<void> {

        this.columnService.columnObs?.subscribe((cols) => {
            this.cols = cols;
        })

        this.positions = this.positionService.fetchPositionValues();

        this.activatedRoute.params.subscribe((params) => {
            this.id = params['id'];
        })

        let player: PlayerDto | null = null;
        if (this.id) {
            this.editMode = true;

            const playerToEdit = this.playerService.players
                .getValue()
                .find((player: PlayerDto) => {
                    return player.id === this.id;
                })

            player = playerToEdit ?? await this.onFetchPlayer(this.id);
        }
        else {
            this.editMode = false;
        }

        this.form = new FormGroup<FormValue>({
            id: new FormControl<number | null>(player?.id ?? 0),
            firstName: new FormControl<string | null>(player?.firstName ?? null, Validators.required),
            lastName: new FormControl<string | null>(player?.lastName ?? null, Validators.required),
            age: new FormControl<number | null>(player?.age ?? 16, [Validators.required, Validators.min(16)]),
            position: new FormControl<Position | null>(player?.position ?? Position.Goalkeeper,
                [Validators.required, Validators.min(Math.min(...this.positions)), Validators.max(Math.max(...this.positions))]),
            club: new FormControl<string | null>(player?.club ?? null, Validators.required),
            country: new FormControl<string | null>(player?.country ?? null, Validators.required),
            photoFile: new FormControl<File | null>(null, Validators.required),
            photoUrl: new FormControl<string | null>(player?.photoUrl ?? null),
            photoBlobName: new FormControl<string | null>(player?.photoBlobName ?? null),
            isSelected: new FormControl<boolean>(player?.isSelected ?? false, { nonNullable: true })
        });
    }

    async onSubmit() {
        if (!this.form?.valid) {
            this.form?.markAsDirty();
            return;
        }

        if (this.editMode)
            await this.onUpdate();
        else
            await this.onCreate()
    }



    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files && input.files[0];
        if (!file) return;

        // store the File object in the form
        this.form?.patchValue({ photoFile: file });

        //preview
        const reader = new FileReader();
        reader.onload = () => (this.form?.patchValue({ photoUrl: reader.result?.toString() || null }));
        reader.readAsDataURL(file);
    }


    private async onCreate() {
        this.isLoading = true;

        const dto = this.getDto(this.form!);

        try {
            let result = await lastValueFrom(this.playersApiService.createPlayer(dto));
            this.alertService.toggleAlert('ALERT_PLAYER_ADDED', AlertType.Success)

            if (result.success) {
                // upload to blob and sql storage
                const uploadResult = await this.uploadBlobPhoto(result.data.id, this.form!.value.photoFile!);

                if (uploadResult) {
                    [result.data.photoBlobName, result.data.photoUrl] = [uploadResult.photoBlobName, uploadResult.uploadUrl];
                }

                //add the new player to the list
                const updatedPlayerList = [...this.playerService.players.getValue(), result.data];

                //sort and push the updated list
                this.playerService.players.next(orderBy(updatedPlayerList,
                    [(p: PlayerDto) => p.firstName.toLowerCase(),
                    (p: PlayerDto) => p.lastName.toLowerCase()]));

                this.isLoading = false;
                this.onClear();
                this.router.navigate(['']);
                return;
            }
            else {
                this.alertService.toggleAlert('ALERT_PLAYER_ADD_FAILURE', AlertType.Danger)
            }

        }
        catch (e) {
            this.alertService.toggleAlert('ALERT_PLAYER_ADD_FAILURE', AlertType.Danger)
        }

        this.isLoading = false;
    }

    private async onUpdate() {
        this.isLoading = true;
        const player = this.getDto(this.form!);

        try {
            const result = await lastValueFrom(this.playersApiService.updatePlayer({ ...player, id: player.id }));
            this.isLoading = false;
            this.alertService.toggleAlert('ALERT_PLAYER_UPDATED', AlertType.Success)

            if (result.data) {

                //if a file has been selected, upload it
                if (this.fileInput?.nativeElement.files?.length) {
                    const uploadResult = await this.uploadBlobPhoto(player.id, this.fileInput.nativeElement.files[0]);

                    if (uploadResult) {
                        // update player blob name in the list
                        result.data = result.data.map((p) => {
                            if (p.id === player.id) {
                                [p.photoBlobName, p.photoUrl] = [uploadResult.photoBlobName, uploadResult.uploadUrl];
                            }

                            return p;
                        })
                    }
                }

                //push updated list and close edit
                this.playerService.players.next(result.data);
                this.onClear();
                this.router.navigate(['']);
                return;
            }
            else {
                this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYERS', AlertType.Warning, result.message)
            }
        }
        catch (e) {
            this.alertService.toggleAlert('ALERT_PLAYER_UPDATE_FAILURE', AlertType.Danger)
        }

        this.isLoading = false;
    }

    onClear() {
        this.fileInput.nativeElement.value = '';
        this.form?.reset();
    }

    private async onFetchPlayer(id: number): Promise<PlayerDto | null> {
        this.isLoading = true;
        try {
            const result = await lastValueFrom(this.playersApiService.fetchPlayerById(id));
            this.isLoading = false;

            if (result.data) {
                return result.data;
            } else {
                this.alertService.toggleAlert('ALERT_PLAYER_NOT_FOUND', AlertType.Warning, result.message)
            }
        }
        catch (e) {
            this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_PLAYER', AlertType.Danger)
            this.isLoading = false;
        }

        return null;
    }

    private getDto(form: FormGroup<FormValue>): PlayerDto {
        const formValue = form!.getRawValue();
        return {
            id: !formValue.id ? 0 : formValue.id,
            firstName: formValue.firstName!,
            lastName: formValue.lastName!,
            age: formValue.age!,
            position: formValue.position!,
            club: formValue.club!,
            country: formValue.country!,
            isSelected: formValue.isSelected,
        };
    }

    private async uploadBlobPhoto(playerId: number, photoFile: File): Promise<{ uploadUrl: string; photoBlobName: string } | undefined> {
        try {
            const sasResponse = await lastValueFrom(this.playersApiService.getUploadSasUrls(playerId, 'image/jpeg'));
            console.log("sasResponse", sasResponse);

            // uploads blob photo to storage
            if (sasResponse.data) {
                const putRes = await fetch(sasResponse.data.uploadUrl, {
                    method: 'PUT',
                    headers: {
                        'x-ms-blob-type': 'BlockBlob',
                        'Content-Type': photoFile.type || 'application/octet-stream'
                    },
                    body: photoFile
                });

                if (!putRes.ok) {
                    throw new Error(`Upload failed with ${putRes.status} ${putRes.statusText}`);
                }

                //saves player photo blob name to sql db
                await lastValueFrom(this.playersApiService.savePlayerPhoto(playerId, sasResponse.data.photoBlobName));
                return sasResponse.data;
            }
        }
        catch (e) {
            this.alertService.toggleAlert('ALERT_PLAYER_PHOTO_UPLOAD_FAILURE', AlertType.Danger)
        }

        return undefined;
    }
}