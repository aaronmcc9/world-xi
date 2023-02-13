using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class FriendRequest
    {
        public int Id { get; set; }
        public int UserSentId { get; set; }
        public int UserReceivedId { get; set; }
        public FriendRequestStatus Status { get; set; }
        public DateTime Created { get; set; }

    }
}