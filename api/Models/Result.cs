using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace api.Models
{
    [System.Runtime.Serialization.DataContract]
  public class Result
  {
    public int Id { get; set; }
    // public List<Team> Teams { get; set; }
    public string Score { get; set; }
    public int? WinnerId { get; set; } = 0;
    public int? LoserId { get; set; } = 0;
    public DateTime DateTime { get; set; }

  }
}