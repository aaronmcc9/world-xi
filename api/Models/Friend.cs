using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class Friendship
  {
    public int Id { get; set;}
    public List<User> Users { get; set;}

  }
}