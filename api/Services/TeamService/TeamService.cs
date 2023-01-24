using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Team;
using api.Dto.Team.Settings;
using api.Models;
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

          return response;
        }

        var savedTeam = await this._dataContext.Team
          .Include(u => u.User)
          .Include(p => p.Players)
          .Include(f => f.Formation)
          .FirstOrDefaultAsync(t => t.User.Id == userId);

        if (savedTeam == null)
        {
          response.Success = false;
          response.Message = "An error occured fetching the user team";
        }

        var team = this._mapper.Map<TeamDto>(savedTeam!);

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

    public async Task<ServiceResponse<TeamDto>> InsertTeam(ModifyTeamDto newTeam)
    {
      var response = new ServiceResponse<TeamDto>();

      try
      {
        var userId = this.GetUserId();
        var team = new Team();

        team.User = this._dataContext.User
          .FirstOrDefault(u => u.Id == userId);

        team.TeamName = newTeam.TeamName;
        team.Players = this._dataContext.Players
          .Where(p => newTeam.PlayerIds.Contains(p.Id))
          .ToList();

        team.Formation = this._dataContext.Formation.
          FirstOrDefault(f => f.Id == newTeam.FormationId);

        this._dataContext.Team.Add(team);
        await this._dataContext.SaveChangesAsync();

        response.Data = this._mapper.Map<TeamDto>(team);
      }
      catch (Exception e)
      {
        response.Success = false;
        response.Message = e.Message;
      }

      return response;
    }

    public async Task<ServiceResponse<TeamDto>> UpdateTeam(ModifyTeamDto updatedteam)
    {
      var response = new ServiceResponse<TeamDto>();

      try
      {
        var userId = this.GetUserId();
        var team = await this._dataContext.Team
          .Include(p => p.Players)
          .FirstOrDefaultAsync(t => t.Id == updatedteam.Id);

        if (team == null)
        {
          response.Success = false;
          response.Message = "An error occured locating the current team";
        }

        if (userId != team.UserId)
        {
          response.Success = false;
          response.Message = "This user does not have permission to modify this team";
        }

        team.TeamName = updatedteam.TeamName;

        team.Players.Clear();
        team.Players = this._dataContext.Players
          .Where(p => updatedteam.PlayerIds.Contains(p.Id))
          .ToList();

        team.Formation = this._dataContext.Formation.
          FirstOrDefault(f => f.Id == updatedteam.FormationId);

        await this._dataContext.SaveChangesAsync();

        response.Data = this._mapper.Map<TeamDto>(team);
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
        var userId = this.GetUserId();

        var team = await this._dataContext.Team
          .FirstOrDefaultAsync(t => t.UserId == userId);

        if (team == null)
        {
          response.Message = "Team not found!";
          response.Success = false;
          return response;
        }

        this._dataContext.Remove(team);
        await this._dataContext.SaveChangesAsync();

      }
      catch (Exception e)
      {
        response.Success = false;
        response.Message = e.Message;
      }

      return response;
    }

    public async Task<ServiceResponse<SettingsDto>> FetchTeamSettings()
    {
      var response = new ServiceResponse<SettingsDto>();
      try
      {
        var userId = this.GetUserId();

        var team = await this._dataContext.Team
          .Include(u => u.User)
          .FirstOrDefaultAsync(t => t.UserId == userId);

        if (team == null)
        {
          response.Data.IsDiscoverable = false;
          response.Data.TeamExists = false;
          response.Message = "The user is yet to create a team.";
          return response;
        }

        response.Data.IsDiscoverable = team.isDiscoverable;
        response.Data.Username = team.User.Username;
        response.Data.TeamName = team.TeamName;
        response.Data.TeamExists = true;

      }
      catch (Exception e)
      {
        response.Message = "Team settings failed to load.";
        response.Success = false;
        response.Data.IsDiscoverable = false;
        response.Data.TeamExists = false;
      }

      return response;
    }

    public async Task<ServiceResponse<SettingsDto>> UpdateTeamSettings(SettingsDto settings)
    {
      var response = new ServiceResponse<SettingsDto>();
      try
      {
        var userId = this.GetUserId();

        var team = this._dataContext.Team
          .Include(u => u.User)
          .FirstOrDefault(t => t.UserId == userId);

        if (team == null)
        {
          response.Success = false;
          response.Message = "Error: User team not found.";
          return response;
        }


        if (team.User.Username != settings.Username &&
          !string.IsNullOrEmpty(team.User.Username))
        {
          var usernameExists = await this._dataContext.Team
            .AnyAsync(t => t.User.Username.ToLower() == settings.Username.ToLower());

          if (usernameExists)
          {
            response.Success = false;
            response.Message = "Error: Username already exists.";
            return response;
          }
        }

        if (team.TeamName != settings.TeamName &&
          !string.IsNullOrEmpty(team.TeamName))
        {
          var teamNameExists = await this._dataContext.Team
            .AnyAsync(t => t.TeamName.ToLower() == settings.TeamName.ToLower());

          if (teamNameExists)
          {
            response.Success = false;
            response.Message = "Error: Team name already exists.";
            return response;
          }
        }

        team.isDiscoverable = settings.IsDiscoverable;
        team.TeamName = settings.TeamName;
        team.User.Username = settings.Username;

        await this._dataContext.SaveChangesAsync();

        response.Message = "Settings have been successfully updated!";
      }
      catch (Exception e)
      {
        response.Success = false;
        response.Message = "An error occured updating your team settings. Please try again.";
      }

      return response;
    }

    private async Task<bool> CheckTeamExists(int userId)
    {
      return await this._dataContext.Team
        .Include(u => u.User)
        .AnyAsync(t => t.User.Id == userId);
    }

    private int GetUserId()
    {
      return int.Parse(this._httpContextAccessor?.HttpContext?.User?
        .FindFirstValue(ClaimTypes.NameIdentifier));
    }
  }
}
