namespace api.Models
{
    public class Role
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<Permission> Permissions { get; set; } = new List<Permission>();

    }
}