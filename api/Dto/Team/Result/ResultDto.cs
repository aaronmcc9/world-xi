using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace api.Dto
{
  [System.Runtime.Serialization.DataContract]
  public class ResultDto
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
  }
}