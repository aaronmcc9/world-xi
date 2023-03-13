using System.Runtime.Serialization;

namespace api.Dto.Stat
{
  public class QuickStatDto
  {
    [DataMember(Name = "name")]
    public string Name { get; set; }
    [DataMember(Name = "value")]
    public int Value { get; set; }

  }
}