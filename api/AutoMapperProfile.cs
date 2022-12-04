using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto.Player;
using api.Models;

namespace api
{
    public class AutoMapperProfile: AutoMapper.Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Player, PlayerDto>();
            CreateMap<PlayerDto, Player>();
        }
    }
}