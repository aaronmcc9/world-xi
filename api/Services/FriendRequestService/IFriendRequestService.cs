using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.User;
using api.Dto.User.Friend.FriendRequest;
using api.Dto.User.Notification;

namespace api.Services.FriendRequestService
{
  public interface IFriendRequestService
  {
    Task<ServiceResponse<string>> CreateFriendRequest(FriendRequestDto friendRequest);
    Task<ServiceResponse<NotificationDto>> UpdateFriendRequest(UpdateFriendRequestDto friendRequest, int notificationId);
  }
}