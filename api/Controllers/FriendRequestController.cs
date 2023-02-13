using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.User;
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
    public async Task<ActionResult<ServiceResponse<string>>> UpdateFriendRequest(FriendRequestDto friendRequest)
    {
      return Ok(await this._friendRequestService.UpdateFriendRequest(friendRequest));
    }
  }
}