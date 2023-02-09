using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace api.Dto
{
  [System.Runtime.Serialization.DataContract]
  public class Result
  {
    [DataMember(Name = "id")]
    public int Id { get; set; }
    // public List<Team> Teams { get; set; }
    [DataMember(Name = "score")]
    public string Score { get; set; }
    [DataMember(Name = "winnerId")]
    public int? WinnerId { get; set; }
    [DataMember(Name = "loserId")]
    public int? LoserId { get; set; }
    [DataMember(Name = "dateTime")]
    public DateTime DateTime { get; set; }

    [NotMapped]
    [DataMember(Name = "wins")]
    public int Wins { get; set; } = 0;

    [NotMapped]
    [DataMember(Name = "losses")]
    public int Losses { get; set; } = 0;

    [NotMapped]
    [DataMember(Name = "draws")]
    public int Draws { get; set; } = 0;
  }
}