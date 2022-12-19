using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Team;

namespace api.Services.TeamService
{
    public interface ITeamService
    {
        Task<ServiceResponse<TeamDto>> FetchTeam();
        Task<ServiceResponse<TeamDto>> InsertTeam(TeamDto team);

        Task<ServiceResponse<TeamDto>> UpdateTeam(TeamDto team);
        Task<ServiceResponse<TeamDto>> DeleteTeam();

        
    }
}