using System.Runtime.Serialization;
using api.Dto.Player;
using api.Dto.Team.Formation;

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

    [DataMember(Name = "results")]
    public List<Result> Results { get; set; } = new List<Result>();

    // [DataMember(Name = "userId")]
    // public int UserId { get; set; } = 0;
    // [DataMember(Name="user")]
    // public UserDto User { get; set; } = new UserDto();
  }
}