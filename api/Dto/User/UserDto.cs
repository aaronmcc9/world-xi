using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using api.Dto.User.Notification;

namespace api.Dto.User
{
  public class UserDto
  {
    [DataMember(Name = "id")]
    public int Id { get; set; }

    [DataMember(Name = "email")]
    public string Email { get; set; } = string.Empty;

    [DataMember(Name = "notifications")]
    public List<NotificationDto> Notifications { get; set; } = new List<NotificationDto>();

    [DataMember(Name = "email")]
    public string AccessToken { get; set; } = string.Empty;

  }
}