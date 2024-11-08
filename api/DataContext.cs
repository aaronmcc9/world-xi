using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api
{
    public class DataContext : DbContext
    {

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        // public DataContext()
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
              new Formation { Id = 8, Structure = "541" },
              new Formation { Id = 9, Structure = "433" }
            );

            // modelBuilder.Entity<Role>().HasData(
            //     new Permission { Id = new Guid("3a4da022-2dc4-41a8-8d0c-d5ecae775b1d"), Name = "CreatePlayer", Description = "The ability to create a new player",  },
            //     new Permission { Id = new Guid("d1a33486-0385-4ed6-9667-2f7a5e521f24"), Name = "EditPlayer", Description = "The ability to edit a player" },
            //     new Permission { Id = new Guid("aae96795-0737-463c-b9d1-45e02ec04f22"), Name = "DeletePlayer", Description = "The ability to delete a player" },
            //     new Permission { Id = new Guid("2d4a2d98-ed5f-4e76-b87c-7b4c604943ff"), Name = "DeleteOtherUser", Description = "The ability to delete another user" },
            //     new Permission { Id = new Guid("308071a54-e068-4f3c-971c-26dd24c4f614"), Name = "ViewAllUsers", Description = "The ability to view all users" },
            //     new Permission { Id = new Guid("431a0ea2-47bf-47be-b19f-b4491f9cadd4"), Name = "ViewPublicUsers", Description = "The ability to view public users only" },
            //     new Permission { Id = new Guid("d653e136-ef5e-490c-9037-2e84bd742a21 "), Name = "ModifyOwnTeam", Description = "The ability to make changes to your own team" },
            //     new Permission { Id = new Guid("d65b3282-384b-467a-8213-04137ff99c13"), Name = "PlayMatch", Description = "The ability to play a match" },
            //     new Permission { Id = new Guid("151d87a0-72e4-4e05-90ef-1eccd7511192"), Name = "MakeFriends", Description = "The ability to make a friend" }
            //  );

            // modelBuilder.Entity<Role>().HasData(
            //     new Role { Id = new Guid("66f94a44-92a6-4a71-b48b-150b95164152"), Name="Admin", Description = "The User responsible for managing the application and soccer player details", Permissions = [] },
            //     new Role { Id = new Guid("2e71c355-aa3a-4b17-8060-28a95ebdc9e5"), Name = "Player", Description = "The User who plays and interacts with the application", Permissions = [] }
            //  );
        }

        public DbSet<Player> Players { get; set; }
        public DbSet<Team> Team { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Formation> Formation { get; set; }
        public DbSet<Result> Result { get; set; }
        public DbSet<Notification> Notification { get; set; }
        public DbSet<Friendship> Friendship { get; set; }
        public DbSet<FriendRequest> FriendRequest { get; set; }

    }
}