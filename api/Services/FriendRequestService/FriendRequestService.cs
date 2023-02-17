using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.User;
using api.Dto.User.Friend.FriendRequest;
using api.Dto.User.Notification;
using api.Models;
using api.Services.NotificationService;
using AutoMapper;

namespace api.Services.FriendRequestService
{
  public class FriendRequestService : IFriendRequestService
  {
    private readonly DataContext _dataContext;
    private readonly IMapper _mapper;
    private readonly INotificationService _notificationService;
    private IHttpContextAccessor _httpContextAccessor;

    public FriendRequestService(DataContext dataContext, IMapper mapper, IHttpContextAccessor httpContextAccessor,
      INotificationService notificationService)
    {
      this._dataContext = dataContext;
      this._mapper = mapper;
      this._httpContextAccessor = httpContextAccessor;
      this._notificationService = notificationService;
    }

    public async Task<ServiceResponse<string>> CreateFriendRequest(FriendRequestDto newFriendRequest)
    {
      var response = new ServiceResponse<string>();
      try
      {

        var friendRequest = this._mapper.Map<FriendRequest>(newFriendRequest);
        friendRequest.UserSentId = this.GetUserId();

        if (friendRequest.UserSentId == null)
        {
          response.Success = false;
          response.Message = "An error occured identifying users. Please try again.";
        }

        this._dataContext.Add(friendRequest);
        await this._dataContext.SaveChangesAsync();

        var senderUsername = this._dataContext.User
          .FirstOrDefault(u => u.Id == friendRequest.UserSentId)
          ?.Username;

        var notificationMessage = $"You received a friend request from {senderUsername}";
        
        await this._notificationService.SendNotification(friendRequest.UserSentId, friendRequest.UserReceivedId, 
          notificationMessage, Models.NotificationType.FriendRequest, true);
        
        response.Message = "Friend request sent!";
      }
      catch (Exception e)
      {
        response.Success = false;
        response.Message = "An error occured creating friend request. " + e.Message;
      }

      return response;
    }

    public async Task<ServiceResponse<NotificationDto>> UpdateFriendRequest(UpdateFriendRequestDto updateFriendRequest, int notificationId)
    {
      var response = new ServiceResponse<NotificationDto>();
      try
      {

        if (updateFriendRequest.Status == Dto.User.Friend.FriendRequestStatus.Pending)
        {
          response.Success = false;
          response.Message = "Invalid Operation: Request must be accepted or rejected.";
          return response;
        }

        var dbfriendRequest = this._dataContext.FriendRequest
          .FirstOrDefault(fr => fr.UserReceivedId == updateFriendRequest.UserReceivedId
            && fr.UserSentId == updateFriendRequest.UserSentId);
          
          dbfriendRequest.Status = (FriendRequestStatus)updateFriendRequest.Status;

        var userReceived = await this._dataContext.User
            .FindAsync(updateFriendRequest.UserReceivedId);

        var userSent = await this._dataContext.User
            .FindAsync(updateFriendRequest.UserSentId);

        if (userReceived == null || userSent == null)
        {
          response.Success = false;
          response.Message = "Invalid Operation: One or more users does not exist.";
          return response;
        }

        var friendRequest = this._mapper.Map<FriendRequest>(updateFriendRequest);

        if (dbfriendRequest.Status == FriendRequestStatus.Accepted)
        {
          Friendship friendship = new Friendship
          {
            Users = new List<User>
            {
                userReceived,
                userSent
            }
          };

          this._dataContext.Friendship.Add(friendship);

          response.Message = $"You and {userSent.Username} are now friends!";
        }
        else if (dbfriendRequest.Status == FriendRequestStatus.Rejected)
        {
          //   var friendship = this._dataContext.Friendship
          //       .FirstOrDefault(f => f.Users.Contains(userOne)
          //         && f.Users.Contains(userTwo));

          //   if (friendship == null)
          //   {
          //     response.Success = false;
          //     response.Message = "Friend Request does not exist.";
          //     return response;
          //   }
          response.Message = $"Friend request denied for {userSent.Username}.";
        }

        this._dataContext.FriendRequest.Update(friendRequest);
        await this._dataContext.SaveChangesAsync();

        var notificationReponse = await this._notificationService.UpdateNotification(notificationId, true, false);
      }
      catch (Exception e)
      {
        response.Success = false;
        response.Message = "There was an error responding to the request. " + e.Message;
      }

      return response;
    }

    private int GetUserId()
    {
      return int.Parse(this._httpContextAccessor?.HttpContext?.User?
        .FindFirstValue(ClaimTypes.NameIdentifier));
    }
  }
}