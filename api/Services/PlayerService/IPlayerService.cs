using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Common;
using api.Dto.Player;

namespace api.Services.PlayerService
{
  public interface IPlayerService
  {
    Task<ServiceResponse<PagedResponseDto<PlayerDto>>> FetchAllPlayers(int? skip, int? take);
    Task<ServiceResponse<PlayerDto>> FetchPlayerById(int id);
    Task<ServiceResponse<PagedResponseDto<PlayerDto>>> FetchPlayerByPosition(PlayerPosition position, int? skip, int? take);
    Task<ServiceResponse<List<PlayerDto>>> InsertPlayer(PlayerDto player);
    Task<ServiceResponse<List<PlayerDto>>> UpdatePlayer(PlayerDto player);
    Task<ServiceResponse<List<PlayerDto>>> DeletePlayer(int id);

  }
}