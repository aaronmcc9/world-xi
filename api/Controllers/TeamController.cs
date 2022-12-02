using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Services.TeamService;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamController: ControllerBase
    {
        public ITeamService _teamService;
        private readonly DataContext _dataContext; 
        public TeamController(DataContext dataContext, ITeamService teamService)
        {
            this._dataContext = dataContext;
            this._teamService = teamService;
        }
    }
}