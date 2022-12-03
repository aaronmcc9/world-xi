
using System.ComponentModel.DataAnnotations;

namespace api.Dto.Player
{
  public enum PlayerPosition
  {
    [Display(Name = "Goalkeeper")]
    Goalkeeper = 0,
    [Display(Name = "Defender")]
    Defender = 1,
    [Display(Name = "Midfield")]
    Midfield = 2,
    [Display(Name = "Forward")]
    Forward = 3
  }
}