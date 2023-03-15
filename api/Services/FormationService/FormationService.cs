using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Team.Formation;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Services.FormationService
{
  public class FormationService : IFormationService
  {
    private readonly DataContext _dataContext;
    private readonly IMapper _mapper;
    public FormationService(DataContext dataContext, IMapper mapper)
    {
      this._mapper = mapper;
      this._dataContext = dataContext;

    }

    public async Task<ServiceResponse<List<FormationDto>>> fetchAllFormations()
    {
      var serviceResponse = new ServiceResponse<List<FormationDto>>();
      try
      {
        serviceResponse.Data = await this._dataContext.Formation
            .OrderBy(f => f.Structure)
            .Select(f => this._mapper.Map<FormationDto>(f))
            .ToListAsync();
      }
      catch (Exception e)
      {
        serviceResponse.Message = "An error occurred while fetching the formations";
        serviceResponse.Success = false;
      }

      return serviceResponse;
    }
  }
}