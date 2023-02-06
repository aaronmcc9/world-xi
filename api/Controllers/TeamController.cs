using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Team;
using api.Dto.Team.Settings;
using api.Services.TeamService;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class TeamController : ControllerBase
  {
    public ITeamService _teamService;
    public TeamController(ITeamService teamService)
    {
      this._teamService = teamService;
    }

    [HttpGet]
    public async Task<ActionResult<ServiceResponse<TeamDto>>> FetchTeam()
    {
      return Ok(await this._teamService.FetchTeam());
    }

    [HttpGet("all")]
    public async Task<ActionResult<ServiceResponse<List<TeamDto>>>> FetchAllTeams(Boolean friends = true, string? filterText = null)
    {
      return Ok(await this._teamService.FetchAllTeams(friends, filterText));
    }

    [HttpGet("settings")]
    public async Task<ActionResult<ServiceResponse<SettingsDto>>> FetchTeamSettings()
    {
      return Ok(await this._teamService.FetchTeamSettings());
    }

    [HttpPost]
    public async Task<ActionResult<ServiceResponse<TeamDto>>> InsertTeam([FromBody] ModifyTeamDto team)
    {
      return Ok(await this._teamService.InsertTeam(team));
    }

    [HttpPut("settings")]
    public async Task<ActionResult<ServiceResponse<SettingsDto>>> UpdateTeamSettings([FromBody] SettingsDto settings)
    {
      return Ok(await this._teamService.UpdateTeamSettings(settings));
    }

    [HttpGet("settings/username")]
    public async Task<ActionResult<ServiceResponse<bool>>> CheckUsernameExists(string name)
    {
      return Ok(await this._teamService.CheckUsernameExists(name));
    }

    [HttpGet("settings/teamName")]
    public async Task<ActionResult<ServiceResponse<bool>>> CheckTeamNameExist(string name)
    {
      return Ok(await this._teamService.CheckTeamNameExists(name));
    }

    [HttpDelete]
    public async Task<ActionResult<ServiceResponse<TeamDto>>> DeleteTeam()
    {
      return Ok(await this._teamService.DeleteTeam());
    }
  }
}