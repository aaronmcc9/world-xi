using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class Team
  {
    public int Id { get; set; }
    public string TeamName { get; set; }
    public List<Player> Players { get; set; }
    public string Formation { get; set; }
    public User User { get; set; }
    public int UserId { get; set; }


  }
}