using System.Runtime.Serialization;
namespace api.Dto.Player
{
    public class PlayerDto
    {
        [DataMember(Name = ("id"))]
        public int Id { get; set; }

        [DataMember(Name = ("firstName"))]
        public string FirstName { get; set; } = string.Empty;

        [DataMember(Name = ("lastName"))]
        public string LastName { get; set; } = string.Empty;

        [DataMember(Name = ("club"))]
        public string Club { get; set; } = string.Empty;

        [DataMember(Name = ("country"))]
        public string Country { get; set; } = string.Empty;

        [DataMember(Name = ("age"))]
        public int Age { get; set; }

        [DataMember(Name = ("position"))]
        public PlayerPosition Position { get; set; } = PlayerPosition.Goalkeeper;

        [DataMember(Name = ("photoBlobName"))]
        public string? PhotoBlobName { get; set; } = string.Empty;

        [DataMember(Name = ("photoUrl"))]
        public string? PhotoUrl { get; set; }

        [DataMember(Name = ("isSelected"))]
        public bool IsSelected { get; set; } = false;

    }
}