using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.User.Notification;
using api.Services.NotificationService;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class NotificationController : ControllerBase
  {
    private readonly INotificationService _notificationService;
    public NotificationController(INotificationService notificationService)
    {
        this._notificationService = notificationService;
    }

    [HttpGet]
    public async Task<ActionResult<ServiceResponse<List<NotificationDto>>>> FetchUserNotifications(int? skip = null, int? take = null)
    {
        return Ok(await this._notificationService.FetchUserNotifications(skip, take));
    }
  }
}