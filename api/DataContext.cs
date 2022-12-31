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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Formation>().HasData(
        new Formation { Id = 1, Structure = "343" },
        new Formation { Id = 2, Structure = "352" },
        new Formation { Id = 3, Structure = "424" },
        new Formation { Id = 4, Structure = "442" },
        new Formation { Id = 5, Structure = "451" },
        new Formation { Id = 6, Structure = "523" },
        new Formation { Id = 7, Structure = "532" },
        new Formation { Id = 8, Structure = "541" }
      );
    }

    public DbSet<Player> Players { get; set; }
    public DbSet<Team> Team { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<Formation> Formation { get; set; }
  }
}