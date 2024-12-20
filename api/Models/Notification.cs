using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public User? Sender { get; set; }
        // public User Recipient { get; set; }
        public int? SenderId { get; set; }
        public int RecipientId { get; set; }
        public string Message { get; set; }
        public NotificationType NotificationType{ get; set; }
        public DateTime Sent { get; set; }
        public bool Read { get; set; } = false;
        public bool ActionRequired { get; set; } = false;
    }
}