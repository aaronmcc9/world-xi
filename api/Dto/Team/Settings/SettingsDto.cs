using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace api.Dto.Team.Settings
{
  [DataContract]
  public class SettingsDto
  {
    [DataMember(Name = "isDiscoverable")]
    public bool IsDiscoverable { get; set; } = false;
    [DataMember(Name = "teamExists")]
    public bool TeamExists { get; set; } = false;
    [DataMember(Name = "username")]
    public string Username { get; set; } = string.Empty;
    [DataMember(Name = "teamName")]
    public string TeamName { get; set; } = string.Empty;

  }
}