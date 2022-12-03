using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Player;
using api.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Services.PlayerService
{
  public class PlayerService : IPlayerService
  {
    private readonly DataContext _dataContext;
    private readonly IMapper _mapper;

    public PlayerService(DataContext dataContext, IMapper mapper)
    {
      this._dataContext = dataContext;
      this._mapper = mapper;
    }

    public IQueryable<Player> Query()
    {
      return this._dataContext.Players;
    }

    public async Task<ServiceResponse<List<PlayerDto>>> FetchAllPlayers()
    {
      var response = new ServiceResponse<List<PlayerDto>>();

      try
      {
        response.Data = await this.Query()
            .Select(p => this._mapper.Map<PlayerDto>(p))
            .ToListAsync();

        return response;
      }
      catch (Exception e)
      {
        response.Success = false;
        response.Message = e.Message;
      }

      return response;
    }

    public async Task<ServiceResponse<PlayerDto>> FetchPlayerById(int id)
    {
      var response = new ServiceResponse<PlayerDto>();
      try
      {
        var player = this.Query()
            .Where(p => p.id == id)
            .ToListAsync();
        
        response.Data = this._mapper.Map<PlayerDto>(player);
      }
      catch (Exception e)
      {
        response.Success = false;
        response.Message = e.Message;
      }


      return response;
    }
  }
}