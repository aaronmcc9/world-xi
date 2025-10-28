using api.Dto;
using api.Dto.Common;
using api.Dto.Player;
using api.Models;

namespace api.Services.PlayerService
{
    public interface IPlayerService
    {

        IQueryable<Player> Query();
        Task<ServiceResponse<PagedResponseDto<PlayerDto>>> FetchAllPlayers(int? skip, int? take);
        Task<ServiceResponse<PlayerDto>> FetchPlayerById(int id);
        Task<ServiceResponse<PagedResponseDto<PlayerDto>>> FetchPlayerByPosition(Dto.Player.PlayerPosition position, int? skip, int? take);
        Task<ServiceResponse<PlayerDto>> InsertPlayer(PlayerDto player);
        Task<ServiceResponse<List<PlayerDto>>> UpdatePlayer(PlayerDto player);
        Task<ServiceResponse<List<PlayerDto>>> DeletePlayer(int id);

    }
}