using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace api.Dto.User.Notification
{
  [DataContract(Name ="Notification")]
  public class NotificationDto
  {
    [DataMember(Name = "id")]
    public int Id { get; set; }
    [DataMember(Name = "sender")]
    public UserDto? Sender { get; set; }
    [DataMember(Name = "senderId")]
    public int? SenderId { get; set; }
    [DataMember(Name = "recipientId")]
    public int RecipientId { get; set; }
    [DataMember(Name = "message")]
    public string Message { get; set; }
    [DataMember(Name = "notificationType")]
    public NotificationType NotificationType { get; set; }
    [DataMember(Name = "sent")]
    public DateTime Sent { get; set; }
    [DataMember(Name = "read")]
    public bool Read { get; set; } = false;
    [DataMember(Name = "actionRequired")]
    public bool ActionRequired { get; set; } = false;


  }
}