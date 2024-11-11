using System.Runtime.Serialization;

namespace api.Dto.User.Friend.FriendRequest
{
  public class UpdateFriendRequestDto
  {
    [DataMember(Name = "userSentId")]
    public int UserSentId { get; set; }
    [DataMember(Name = "userReceivedId")]
    public int UserReceivedId { get; set; }

    [DataMember(Name = "status")]
    public FriendRequestStatus Status { get; set; }
  }
}