using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto.Player;
using api.Dto.Team;
using api.Dto.Team.Formation;
using api.Dto.Team.Settings;
using api.Dto.User;
using api.Models;

namespace api
{
  public class AutoMapperProfile : AutoMapper.Profile
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

    //   CreateMap<SettingsDto, Team>()
    //     .ForMember(x => x.Id, x => x.Ignore())
    //     .ForMember(x => x.Formation, x => x.Ignore())
    //     .ForMember(x => x.Players, x => x.Ignore())
    //     .ForMember(x => x.UserId, x => x.Ignore())
    //     .ForMember(x => x.User.Id, x => x.Ignore())
    //     .ForMember(x => x.User.PasswordHash, x => x.Ignore())
    //     .ForMember(x => x.User.PasswordSalt, x => x.Ignore())
    //     .ForMember(x => x.User.AccessToken, x => x.Ignore())
    //     .ForMember(x => x.User.Email, x => x.Ignore())
    //     .ForMember(x => x.User.Team, x => x.Ignore());

    }
  }
}