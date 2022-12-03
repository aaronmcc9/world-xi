using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class Team
  {
    public int Id { get; set; }
    public string TeamName { get; set; } = string.Empty;
    public List<Player> Players { get; set; } = new List<Player>();
    public string Formation { get; set; } = string.Empty;
    public User User { get; set; } = new User();
    public int UserId { get; set; }


  }
}