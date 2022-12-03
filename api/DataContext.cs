using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api
{
  public class DataContext : DbContext
  {

    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    public DbSet<Player> Players { get; set; }
    public DbSet<Team> Team { get; set; }
    public DbSet<User> User { get; set; }
  }
}