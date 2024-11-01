using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string? Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public List<Notification> Notifications { get; set; }
        public Team? Team { get; set; }
        public List<Friendship> Friends { get; set; }

        public List<Role> Roles { get; private set; }

        [NotMapped]
        public string AccessToken { get; set; }
    }
}