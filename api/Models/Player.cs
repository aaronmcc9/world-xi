using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Club { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public int Age { get; set; }
        public PlayerPosition Position { get; set; } = PlayerPosition.Goalkeeper;
        public string? ImagePath { get; set; } = string.Empty;
        public bool IsSelected { get; set; } = false;
        public List<Team> Teams { get; set; }

    }
}