import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/alert/alert.service';
import { TeamApiService } from 'src/app/api/team/team-api.service';
import { lastValueFrom } from 'rxjs';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface FormValue {
  isDiscoverable: FormControl<boolean>,
  username: FormControl<string>,
  teamName: FormControl<string>
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  form!: FormGroup<FormValue>;

  constructor(private teamApiService: TeamApiService,
    private alertService: AlertService) { }

  async ngOnInit(): Promise<void> {

    let isDiscoverableControl = new FormControl<boolean>(false,
      {
        nonNullable: true,
        validators: [Validators.required]
      });

    let usernameControl = new FormControl<string>("",
      {
        nonNullable: false,
        validators: [Validators.minLength(5)]
      });

    let teamNameControl = new FormControl<string>("",
      {
        nonNullable: false,
        validators: [Validators.minLength(3)]
      });


    await this.fetchSettingDetails();
  }

  private async fetchSettingDetails() {
    try {
      const result = await lastValueFrom(this.teamApiService.fetchTeamSettings());

      if (result.success) {
        this.form.patchValue({
          isDiscoverable: result.data.isDiscoverable,
          username: result.data.username,
          teamName: result.data.teamName

        });
      }
      else {
        this.alertService.toggleAlert('ALERT_UNABLE_TO_TEAM_SETTINGS', AlertType.Danger, result.message);
      }
    }
    catch (e) {
      this.alertService.toggleAlert('ALERT_UNABLE_TO_TEAM_SETTINGS', AlertType.Danger);
    }
  }
}
