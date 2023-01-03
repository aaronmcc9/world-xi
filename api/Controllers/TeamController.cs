using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Team;
using api.Services.TeamService;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamController: ControllerBase
    {
        public ITeamService _teamService;
        public TeamController(DataContext dataContext, ITeamService teamService)
        {
            this._teamService = teamService;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<TeamDto>>> FetchTeam(){
            return Ok(await this._teamService.FetchTeam());    
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<TeamDto>>> InsertTeam([FromBody] TeamDto team){
            return Ok(await this._teamService.InsertTeam(team));    
        }

        [HttpPut]
        public async Task<ActionResult<ServiceResponse<TeamDto>>> UpdateTeam(TeamDto team){
            return Ok(await this._teamService.UpdateTeam(team));    
        }

        [HttpDelete]
        public async Task<ActionResult<ServiceResponse<TeamDto>>> DeleteTeam(){
            return Ok(await this._teamService.DeleteTeam());    
        }
    }
}