using System.Runtime.Serialization;
using api.Dto.User.Friend;

namespace api.Dto.User
{
  [DataContract]
  public class FriendRequestDto
  {
    [DataMember(Name = "id")]
    public int Id { get; set; }
    [DataMember(Name = "userSentId")]
    public int UserSentId { get; set; }

    [DataMember(Name = "userReceivedId")]
    public int UserReceivedId { get; set; }
    [DataMember(Name = "userSent")]
    public UserDto? UserSent { get; set; }

    [DataMember(Name = "userReceived")]
    public UserDto? UserReceived { get; set; }

    [DataMember(Name = "status")]
    public FriendRequestStatus Status { get; set; }
    [DataMember(Name = "created")]
    public DateTime Created { get; set; }
  }
}