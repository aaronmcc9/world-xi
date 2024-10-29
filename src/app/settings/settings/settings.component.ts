import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/alert/alert.service';
import { TeamApiService } from 'src/app/api/team/team-api.service';
import { lastValueFrom } from 'rxjs';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Settings } from 'src/app/api/team/settings.dto';
import { faCircleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { UsernameValidator } from 'src/app/Validators/username.validator';
import { TranslateService } from '@ngx-translate/core';

interface FormValue {
  discoverable: FormControl<boolean>,
  username: FormControl<string | null>,
  teamName: FormControl<string | null>
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  form!: FormGroup<FormValue>;
  savedSettings: Settings | null = null;

  teamExists = false;
  isLoading = false;
  usernameExists = false;
  teamNameExists = false;


  //icons
  existsError = faCircleExclamation;
  nameAvailable = faCircleCheck;

  constructor(private teamApiService: TeamApiService,
    private alertService: AlertService, private translateService: TranslateService) { }

  async ngOnInit(): Promise<void> {

    let isDiscoverableControl = new FormControl<boolean>(false,
      {
        nonNullable: true,
        validators: [Validators.required]
      });

    let usernameControl = new FormControl<string>({
      value: "",
      disabled: true
    },
      {
        nonNullable: false,
        validators: [Validators.required, Validators.minLength(5), Validators.maxLength(15), UsernameValidator.cannotContainSpace]
      });

    let teamNameControl = new FormControl<string>({
      value: "",
      disabled: true
    },
      {
        nonNullable: false,
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15)]
      });

    isDiscoverableControl.valueChanges
      .subscribe((enabled: boolean) => {
        if (enabled) {
          usernameControl.enable();
          teamNameControl.enable();
        } else {
          usernameControl.disable();
          teamNameControl.disable();

        }
      });

    usernameControl.valueChanges
      .subscribe(async (val: string | null) => {
        this.usernameExists = val ? await this.checkUsernameExists(val) : false;
      });

    teamNameControl.valueChanges
      .subscribe(async (val: string | null) => {
        this.teamNameExists = val ? await this.checkTeamNameExists(val) : false;
      });

    this.form = new FormGroup<FormValue>({
      discoverable: isDiscoverableControl,
      username: usernameControl,
      teamName: teamNameControl
    });

    await this.fetchSettingDetails();
  }

  private async fetchSettingDetails() {
    this.isLoading = true;

    try {
      const result = await lastValueFrom(this.teamApiService.fetchTeamSettings());

      if (result.success) {
        this.savedSettings = result.data;
        this.setDto(this.savedSettings);
        this.teamExists = result.data.teamExists;

        if (!this.teamExists) {
          this.form.controls['discoverable'].disable()
          this.alertService.toggleAlert('ALERT_NO_TEAM', AlertType.Info);
        }
      }
      else {
        this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_TEAM_SETTINGS', AlertType.Danger, result.message);
      }

      this.isLoading = false;
    }
    catch (e) {
      this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_TEAM_SETTINGS', AlertType.Danger);
      this.isLoading = false;
    }
  }

  cancel() {
    this.savedSettings ?
      this.setDto(this.savedSettings) : this.form.reset();

    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  async saveSettings() {
    if (!this.form.valid) {
      this.form.markAsDirty();
      return;
    }

    this.isLoading = true;
    try {
      let dto = this.getDto();
      const result = await lastValueFrom(this.teamApiService.updateTeamSettings(dto));

      this.isLoading = false;
      if (result.success) {
        this.form.markAsUntouched();
        this.form.markAsPristine();
        this.alertService.toggleAlert("ALERT_UPDATE_SETTINGS_SUCCESS", AlertType.Success);
      }
      else {
        this.alertService.toggleAlert("", AlertType.Danger, result.message);
      }

    }
    catch (e) {
      this.isLoading = false;
      this.alertService.toggleAlert("ALERT_UNABLE_TO_UPDATE_TEAM_SETTINGS", AlertType.Danger);
    }
  }

  getError(controlName: string): string {

    if (this.usernameExists && controlName == "username")
      return this.translateService.instant("USERNAME_EXISTS");
    if (this.teamNameExists && controlName == "teamName")
      return this.translateService.instant("TEAM_NAME_EXISTS");
    else if (this.form.hasError('cannotContainSpace', controlName))
      return this.translateService.instant("VALIDATION_CANNOT_CONTAIN", { 'char': "spaces" });
    else if (this.form.hasError('minlength', controlName))
      return this.translateService.instant("VALIDATION_MIN_LENGTH", { 'len': this.form.get(controlName)?.errors?.['minlength'].requiredLength });
    else if (this.form.hasError('maxlength', controlName))
      return this.translateService.instant("VALIDATION_MAX_LENGTH", { 'len': this.form.get(controlName)?.errors?.['maxlength'].requiredLength });
    else if (this.form.hasError('required', controlName))
      return this.translateService.instant("VALIDATION_REQUIRED");

    return "";
  }

  private async checkUsernameExists(name: string): Promise<boolean> {
    try {
      const result = await lastValueFrom(this.teamApiService.checkUsernameExists(name))
      return result.data;
    }
    catch (e) {
      this.alertService.toggleAlert("ALERT_UNABLE_TO_VALIDATE_USERNAME", AlertType.Warning)
    }

    //return false as we dont want to indicate its taken if errors, alert will handle informing user
    return false;
  }

  private async checkTeamNameExists(name: string): Promise<boolean> {
    try {
      const result = await lastValueFrom(this.teamApiService.checkTeamNameExists(name))
      return result.data;
    }
    catch (e) {
      this.alertService.toggleAlert("ALERT_UNABLE_TO_VALIDATE_TEAMNAME", AlertType.Warning)
    }

    //return false as we dont want to indicate its taken if errors, alert will handle informing user
    return false;
  }

  private getDto(): Settings {
    let formValue = this.form.getRawValue();

    return {
      isDiscoverable: formValue.discoverable,
      teamName: formValue.teamName,
      username: formValue.username
    } as Settings;
  }

  private setDto(settings: Settings) {
    this.form.patchValue({
      discoverable: settings.isDiscoverable,
      username: settings.username,
      teamName: settings.teamName
    });
  }
}
