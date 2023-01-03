using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto.Player;
using api.Dto.Team;
using api.Dto.Team.Formation;
using api.Dto.User;
using api.Models;

namespace api
{
    public class AutoMapperProfile: AutoMapper.Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Player, PlayerDto>();
            CreateMap<PlayerDto, Player>();
            CreateMap<UserDto, User>();
            CreateMap<User, UserDto>();
            CreateMap<Team, TeamDto>();
            CreateMap<TeamDto, Team>();
            CreateMap<Formation, FormationDto>();
            CreateMap<FormationDto, Formation>();

        }
    }
}