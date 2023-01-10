using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Common;
using api.Dto.Player;
using api.Services.PlayerService;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class PlayerController : ControllerBase
  {
    private readonly DataContext _dataContext;
    private readonly IPlayerService _playerService;
    public PlayerController(DataContext dataContext, IPlayerService playerService)
    {
      this._playerService = playerService;
      this._dataContext = dataContext;
    }

    [HttpGet]
    public async Task<ActionResult<ServiceResponse<PagedResponseDto<PlayerDto>>>> FetchAllPlayers(int? skip, int? take)
    {
      return Ok(await this._playerService.FetchAllPlayers(skip, take));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceResponse<PlayerDto>>> FetchPlayerById(int id)
    {
      var response = await this._playerService.FetchPlayerById(id);

      if (response.Data == null)
        return NotFound(response);

      return Ok(response);
    }

    [HttpGet("position")]
    public async Task<ActionResult<ServiceResponse<PagedResponseDto<PlayerDto>>>> FetchPlayerByPosition(PlayerPosition position, int? skip,
      int? take)
    {
      var response = await this._playerService.FetchPlayerByPosition(position, skip, take);

      if (response.Data == null)
        return NotFound(response);

      return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceResponse<List<PlayerDto>>>> InsertPlayer(PlayerDto newPlayer)
    {
      var response = await this._playerService.InsertPlayer(newPlayer);
      return Ok(response);
    }

    [HttpPut]
    public async Task<ActionResult<ServiceResponse<List<PlayerDto>>>> UpdatePlayer(PlayerDto playerToUpdate)
    {
      return Ok(await this._playerService.UpdatePlayer(playerToUpdate));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ServiceResponse<List<PlayerDto>>>> DeletePlayer(int id)
    {
      if (id == 0)
        return NotFound("Player not found");

      return Ok(await this._playerService.DeletePlayer(id));
    }
  }
}