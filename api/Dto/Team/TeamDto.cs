using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using api.Dto.Player;
using api.Dto.Team.Formation;
using api.Dto.User;
using api.Dto.User.Friend;

namespace api.Dto.Team
{
  [DataContract(Name = "team")]
  public class TeamDto
  {
    [DataMember(Name = "id")]
    public int Id { get; set; } = 0;
    [DataMember(Name = "players")]
    public List<PlayerDto> Players { get; set; } = new List<PlayerDto>();

    [DataMember(Name = "formation")]
    public FormationDto Formation { get; set; }

    [DataMember(Name = "teamName")]
    public string TeamName { get; set; } = string.Empty;

    [DataMember(Name = "user")]
    public UserDto User { get; set; }

    [DataMember(Name = "results")]
    public List<ResultDto> Results { get; set; } = new List<ResultDto>();

    [DataMember(Name ="established")]
    public DateTime Established { get; set; }

    [NotMapped]
    [DataMember(Name = "wins")]
    public int Wins { get; set; } = 0;

    [NotMapped]
    [DataMember(Name = "losses")]
    public int Losses { get; set; } = 0;

    [NotMapped]
    [DataMember(Name = "draws")]
    public int Draws { get; set; } = 0;
    
    [NotMapped]
    [DataMember(Name = "friendRequestStatus")]
    public FriendRequestStatus? FriendRequestStatus { get; set; } = null;
  }
}