using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Team.Formation;
using api.Services.FormationService;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class FormationController : ControllerBase
  {
    private readonly IFormationService _formationService;
    public FormationController(IFormationService formationService)
    {
      this._formationService = formationService;

    }

    [HttpGet]
    public async Task<ActionResult<ServiceResponse<List<FormationDto>>>> fetchAllFormations()
    {
      return Ok(await this._formationService.fetchAllFormations());
    }
  }
}