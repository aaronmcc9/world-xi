using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace api.Dto.User
{
    public class UserDto
    {
        [DataMember(Name="id")]
        public int Id { get; set; }
        
        [DataMember(Name="email")]
        public string Email { get; set; } = string.Empty;

         [DataMember(Name="email")]
        public string AccessToken { get; set; } = string.Empty;

    }
}