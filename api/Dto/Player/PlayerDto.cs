using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace api.Dto.Player
{
    public class PlayerDto
    {
        [DataMember(Name =("id"))]
        public int Id { get; set; }

        [DataMember(Name =("firstName"))]
        public string FirstName { get; set; } = string.Empty;
        
        [DataMember(Name =("lastName"))]
        public string LastName { get; set; } = string.Empty;
        
        [DataMember(Name =("club"))]
        public string Club { get; set; } = string.Empty;
        
        [DataMember(Name =("country"))]
        public string Country { get; set; } = string.Empty;

        [DataMember(Name =("age"))]
        public int Age { get; set; }
        
        [DataMember(Name =("position"))]
        public PlayerPosition Position { get; set; } = PlayerPosition.Goalkeeper;

        [DataMember(Name =("imagePath"))]
        public string? ImagePath { get; set; } = string.Empty;

        [DataMember(Name =("isSelected"))]
        public bool IsSelected { get; set; } = false;

    }
}