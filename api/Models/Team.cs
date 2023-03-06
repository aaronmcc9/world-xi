using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class Team
  {
    public int Id { get; set; }
    public string? TeamName { get; set; }
    public List<Player> Players { get; set; } = new List<Player>();
    public Formation Formation { get; set; }
    public User User { get; set; }
    public int UserId { get; set; }
    public bool isDiscoverable { get; set; }
    public DateTime Established { get; set; }
    public List<Result> Results { get; set; }

  }
}