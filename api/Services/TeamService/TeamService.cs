using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Team;
using AutoMapper;

namespace api.Services.TeamService
{
  public class TeamService : ITeamService
  {
    private readonly DataContext _dataContext;
    private IMapper _mapper;

    public TeamService(DataContext dataContext, IMapper mapper)
    {
      this._dataContext = dataContext;
      this._mapper = mapper;
    }

    public async Task<ServiceResponse<TeamDto>> FetchTeam()
    {
      var response = new ServiceResponse<TeamDto>();
      try
      {

      }
      catch (Exception e)
      {
        response.Success = false;
        response.Message = e.Message;
      }

      return response;
    }

    public async Task<ServiceResponse<TeamDto>> InsertTeam(TeamDto team)
    {
      var response = new ServiceResponse<TeamDto>();
      try
      {
        
      }
      catch (Exception e)
      {
        response.Success = false;
        response.Message = e.Message;
      }

      return response;
    }

    public async Task<ServiceResponse<TeamDto>> UpdateTeam(TeamDto team)
    {
      var response = new ServiceResponse<TeamDto>();
      try
      {

      }
      catch (Exception e)
      {
        response.Success = false;
        response.Message = e.Message;
      }

      return response;
    }

    public async Task<ServiceResponse<TeamDto>> DeleteTeam()
    {
      var response = new ServiceResponse<TeamDto>();
      try
      {

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