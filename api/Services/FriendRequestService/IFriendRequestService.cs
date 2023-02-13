using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.User;

namespace api.Services.FriendRequestService
{
  public interface IFriendRequestService
  {
    Task<ServiceResponse<string>> CreateFriendRequest(FriendRequestDto friendRequest);
    Task<ServiceResponse<string>> UpdateFriendRequest(FriendRequestDto friendRequest);
  }
}