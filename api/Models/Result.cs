using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class Result
  {
    public int Id { get; set; }
    public List<Team> Teams { get; set; }
    public string Score { get; set; }
    public int? WinnerId { get; set; }
    public int? LoserId { get; set; }
    public DateTime DateTime { get; set; }

  }
}