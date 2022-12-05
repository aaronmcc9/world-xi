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
        Task<ServiceResponse<List<PlayerDto>>> InsertPlayer(PlayerDto player);
        Task<ServiceResponse<List<PlayerDto>>> UpdatePlayer(PlayerDto player);
        Task<ServiceResponse<List<PlayerDto>>> DeletePlayer(int id);

    }
}