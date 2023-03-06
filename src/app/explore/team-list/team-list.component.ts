import { Component, Input, OnChanges } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { TeamApiService } from 'src/app/api/team/team-api.service';
import { FriendRequestApiService } from 'src/app/api/User/Friend/friend request/friend-request-api.service';
import { FriendRequestStatus } from 'src/app/api/User/Friend/friend request/friend-request-status.enum';
import { FriendRequest } from 'src/app/api/User/Friend/friend request/friend-request.dto';
import { Team } from 'src/app/team/team.model';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnChanges {

  @Input("friends") friends = false;
  teams: Team[] = [];
  isLoading = false;
  readonly friendRequestStatus = FriendRequestStatus;



  constructor(private teamApiService: TeamApiService, private alertService: AlertService,
    private friendRequestApiService: FriendRequestApiService) { }

  async ngOnChanges(): Promise<void> {
    await this.reset(this.friends);
  }

  async reset(friends: boolean, filterText?: string) {
    await this.fetchTeams(friends, filterText);
  }

  async fetchTeams(friends: boolean, filterText?: string) {
    try {
      this.isLoading = true;
      const result = await lastValueFrom(this.teamApiService.fetchAllTeams(friends, filterText));

      console.log(result.success)
      if (result.success) {
        this.teams = result.data;
      }
      else {
        this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_TEAMS', AlertType.Danger, result.message)
      }

      this.isLoading = false;
    }
    catch (e) {
      this.isLoading = false;
      this.alertService.toggleAlert('ALERT_UNABLE_TO_FETCH_TEAMS', AlertType.Danger);
    }
  }

  async addFriend(userRequestedId: number) {

    let friendRequest: FriendRequest = {
      id: 0,
      status: FriendRequestStatus.Pending,
      userReceivedId: userRequestedId,
      userSentId: 0, //will get at backend
      created: new Date(new Date().toUTCString())
    };


    try {

      this.updateTeamByUser(userRequestedId, true, undefined);

      const result = await lastValueFrom(this.friendRequestApiService.createFriendRequest(friendRequest));

      if (result.success) {
        this.alertService.toggleAlert("", AlertType.Info, result.message,)
        this.updateTeamByUser(userRequestedId, false, FriendRequestStatus.Pending);

      }
      else {
        this.alertService.toggleAlert("", AlertType.Danger, result.message)
        this.updateTeamByUser(userRequestedId, false, undefined);
      }

    }
    catch (e) {
      this.alertService.toggleAlert("ALERT_FRIEND_REQUEST_FAILURE", AlertType.Danger);
      this.updateTeamByUser(userRequestedId, false, undefined);
    }

  }

  private updateTeamByUser(userRequestedId: number, updateSendingStatus: boolean, friendRequestStatus?: FriendRequestStatus) {
    this.teams.map((team: Team) => {

      if (team.user.id != userRequestedId)
        return team;

      team.friendRequestSending = updateSendingStatus;
      team.friendRequestStatus = friendRequestStatus;
      return team;
    })
  }

}
