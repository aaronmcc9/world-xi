using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace api.Dto.Team.Formation
{
  public class FormationDto
  {
    [DataMember(Name = "id")]
    public int Id { get; set; }
    [Display(Name = "structure")]
    public string Structure { get; set; } = "442";
  }
}