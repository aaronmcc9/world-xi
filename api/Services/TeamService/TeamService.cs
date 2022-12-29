using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Team;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Services.TeamService
{
  public class TeamService : ITeamService
  {
    private readonly DataContext _dataContext;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;


    public TeamService(DataContext dataContext, IMapper mapper, IHttpContextAccessor httpContextAccessor)
    {
      this._dataContext = dataContext;
      this._mapper = mapper;
      this._httpContextAccessor = httpContextAccessor;
    }

    public async Task<ServiceResponse<TeamDto>> FetchTeam()
    {
      var response = new ServiceResponse<TeamDto>();
      try
      {
        var userId = this.GetUserId();

        if (!await this.CheckTeamExists(userId))
        {
          //true to signal no error has occurred
          response.Success = true;
          response.Message = "No team saved for the user";
          response.Data = new TeamDto();
          response.Data.UserId = userId;

          return response;
        }

        var savedTeam = this._dataContext.Team.
          FirstOrDefaultAsync(t => t.UserId == userId);

        if (savedTeam == null)
        {
          response.Success = false;
          response.Message = "An error occured fetching the user team";
        }

        var team = this._mapper.Map<TeamDto>(savedTeam);

        response.Success = true;
        response.Data = team;

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

    private async Task<bool> CheckTeamExists(int userId)
    {
      return await this._dataContext.Team
        .AnyAsync(t => t.UserId == userId);
    }

    private int GetUserId()
    {
      var user = this._httpContextAccessor?.HttpContext?.User?
        .FindFirstValue(ClaimTypes.NameIdentifier);

      var x = int.Parse(user);
      return x;
    }
  }
}
