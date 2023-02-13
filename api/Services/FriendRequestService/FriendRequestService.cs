using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.User;
using api.Models;
using AutoMapper;

namespace api.Services.FriendRequestService
{
  public class FriendRequestService : IFriendRequestService
  {
    private readonly DataContext _dataContext;
    private readonly IMapper _mapper;
    private IHttpContextAccessor _httpContextAccessor;

    public FriendRequestService(DataContext dataContext, IMapper mapper, IHttpContextAccessor httpContextAccessor)
    {
      this._dataContext = dataContext;
      this._mapper = mapper;
      this._httpContextAccessor = httpContextAccessor;
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

        response.Message = "Friend request sent!";
      }
      catch (Exception e)
      {
        response.Success = false;
        response.Message = "An error occured creating friend request. " + e.Message;
      }

      return response;
    }

    public async Task<ServiceResponse<string>> UpdateFriendRequest(FriendRequestDto updateFriendRequest)
    {
      var response = new ServiceResponse<string>();
      try
      {
        if (updateFriendRequest.Status == Dto.User.Friend.FriendRequestStatus.Pending)
        {
          response.Success = false;
          response.Message = "Invalid Operation: Request must be accepted or rejected.";
          return response;
        }

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

        if (updateFriendRequest.Status == Dto.User.Friend.FriendRequestStatus.Accepted)
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
          response.Message = $"You and {userReceived.Username} are now friends!";
        }
        else if (updateFriendRequest.Status == Dto.User.Friend.FriendRequestStatus.Rejected)
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
          response.Message = $"Friend request denied for {userReceived.Username}.";
        }

        this._dataContext.FriendRequest.Update(friendRequest);
        await this._dataContext.SaveChangesAsync();
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