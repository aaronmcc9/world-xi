using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using api.Dto.Player;
using api.Dto.User;

namespace api.Dto.Team
{
  public class TeamDto
  {
    [DataMember(Name="players")]
    public List<PlayerDto> Players { get; set; } = new List<PlayerDto>();

    [DataMember(Name="formation")]
    public string Formation { get; set; } = string.Empty;
    
    [DataMember(Name="teamName")]
    public string TeamName { get; set; } = string.Empty;
    
    [DataMember(Name="user")]
    public UserDto User { get; set; } = new UserDto();
  }
}