using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Player;

namespace api.Services.PlayerService
{
    public interface IPlayerService
    {
        Task<ServiceResponse<List<PlayerDto>>> FetchAllPlayers();
        Task<ServiceResponse<PlayerDto>> FetchPlayerById(int id);

    }
}