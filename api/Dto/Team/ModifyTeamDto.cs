using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace api.Dto.Team
{
  [DataContract]
  public class ModifyTeamDto
  {
    [DataMember(Name = "id")]
    public int Id { get; set; } = 0;
    [DataMember(Name = "playersIds")]
    public List<int> PlayerIds { get; set; } = new List<int>();

    [DataMember(Name = "formationId")]
    public int FormationId { get; set; }

    [DataMember(Name = "teamName")]
    public string TeamName { get; set; } = string.Empty;
  }
}