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
        
        [DataMember(Name="username")]
        public string Username { get; set; } = string.Empty;

    }
}