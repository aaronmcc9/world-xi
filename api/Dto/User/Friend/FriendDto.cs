using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using api.Dto.Team;

namespace api.Dto.User.Friend
{
  [DataContract]
  public class FriendDto
  {
    [DataMember(Name = "id")]
    public int Id { get; set; }
    [DataMember(Name = "userId")]
    public int UserId { get; set; }
    [DataMember(Name = "username")]
    public string Username { get; set; }
    [DataMember(Name = "team")]
    public TeamDto Team { get; set; }
  }
}