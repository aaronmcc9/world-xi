using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Player;
using api.Models;
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
    public async Task<ActionResult<List<PlayerDto>>> FetchAllPlayers()
    {
        return Ok(await this._playerService.FetchAllPlayers());   
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceResponse<PlayerDto>>> FetchPlayerById(int id)
    {
        var response = await this._playerService.FetchPlayerById(id);

        if(response.Data == null)
            return NotFound(response);

        return Ok(response);
    }
  }
}