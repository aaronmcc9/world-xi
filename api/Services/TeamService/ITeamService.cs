using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Team;
using api.Dto.Team.Settings;

namespace api.Services.TeamService
{
  public interface ITeamService
  {
    Task<ServiceResponse<TeamDto>> FetchTeam(int? Id);
    Task<ServiceResponse<List<TeamDto>>> FetchAllTeams(Boolean friends = true, string? filterText = null);
    Task<ServiceResponse<TeamDto>> InsertTeam(ModifyTeamDto team);

    Task<ServiceResponse<TeamDto>> UpdateTeam(ModifyTeamDto team);
    Task<ServiceResponse<TeamDto>> DeleteTeam();
    Task<ServiceResponse<SettingsDto>> FetchTeamSettings();
    Task<ServiceResponse<SettingsDto>> UpdateTeamSettings(SettingsDto settings);
    Task<ServiceResponse<bool>> CheckUsernameExists(string name);
    Task<ServiceResponse<bool>> CheckTeamNameExists(string name);



  }
}