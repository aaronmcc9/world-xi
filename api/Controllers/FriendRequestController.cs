using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.User;
using api.Dto.User.Friend.FriendRequest;
using api.Dto.User.Notification;
using api.Services.FriendRequestService;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class FriendRequestController: ControllerBase
  {
    private readonly IFriendRequestService   _friendRequestService;
    public FriendRequestController(IFriendRequestService friendRequestService)
    {
        this._friendRequestService = friendRequestService;
    }

    [HttpPost]
    public async Task<ActionResult<ServiceResponse<string>>> CreateFriendRequest(FriendRequestDto friendRequest)
    {
      return Ok(await this._friendRequestService.CreateFriendRequest(friendRequest));
    }

    [HttpPut]
    public async Task<ActionResult<ServiceResponse<NotificationDto>>> UpdateFriendRequest(UpdateFriendRequestDto friendRequest, int notificationId)
    {
      return Ok(await this._friendRequestService.UpdateFriendRequest(friendRequest, notificationId));
    }
  }
}