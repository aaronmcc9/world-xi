import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { FriendRequestApiService } from 'src/app/api/User/Friend/friend request/friend-request-api.service';
import { FriendRequestStatus } from 'src/app/api/User/Friend/friend request/friend-request-status.enum';
import { FriendRequest } from 'src/app/api/User/Friend/friend request/friend-request.dto';
import { Team } from '../team.model';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.css']
})
export class TeamInfoComponent implements OnInit {

  team: Team | null = null
  constructor(private teamService: TeamService, private alertService:AlertService,
    private friendRequestApiService: FriendRequestApiService) { }

  ngOnInit(): void {
    this.teamService.savedTeam.subscribe((team) => {
      this.team = team;
    })
  }


  async addFriend() {
    if (this.team)
      return;

    let friendRequest: FriendRequest = {
      id: 0,
      status: FriendRequestStatus.Pending,
      userReceivedId: this.team!.id,
      userSentId: 0, //will get at backend
      created: new Date(new Date().toUTCString())
    };


    try {

      const result = await lastValueFrom(this.friendRequestApiService.createFriendRequest(friendRequest));

      if (result.success) {
        this.alertService.toggleAlert("", AlertType.Info, result.message)

      }
      else {
        this.alertFriendRequestFailure("", result.message);
      }

    }
    catch (e) {
      this.alertFriendRequestFailure("ALERT_FRIEND_REQUEST_FAILURE")
      this.alertService.toggleAlert("ALERT_FRIEND_REQUEST_FAILURE", AlertType.Danger);
    }
  }

  alertFriendRequestFailure(key: string, error?:string){
    this.alertService.toggleAlert("ALERT_FRIEND_REQUEST_FAILURE", AlertType.Danger);
  }
}
