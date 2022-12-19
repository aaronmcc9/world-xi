using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace api.Dto.User
{
  public class UserRequestDto
  {
    [DataMember(Name = "id")]
    public string Email { get; set; }
    
    [DataMember(Name = "password")]
    public string Password { get; set; }

  }
}