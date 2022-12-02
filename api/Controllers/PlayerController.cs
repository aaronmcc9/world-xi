using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Services.PlayerService;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayerController:ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly IPlayerService _playerService;
        public PlayerController(DataContext dataContext, IPlayerService playerService)
        {
            this._playerService = playerService;
            this._dataContext = dataContext; 
        }

    }
}