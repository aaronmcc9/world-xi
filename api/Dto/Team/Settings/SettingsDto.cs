using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Team.Settings
{
    public class SettingsDto
    {
        public bool isDiscoverable { get; set; }
        public bool teamExists { get; set; }
        public string Username { get; set; }
        public string TeamName { get; set; }

    }
}