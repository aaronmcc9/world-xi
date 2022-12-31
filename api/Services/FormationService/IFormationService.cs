using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Team.Formation;

namespace api.Services.FormationService
{
    public interface IFormationService
    {
        Task<ServiceResponse<List<FormationDto>>> fetchAllFormations();
    }
}