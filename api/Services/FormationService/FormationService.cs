using api.Dal.Contracts.Common;
using api.Dto;
using api.Dto.Team.Formation;
using api.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Services.FormationService
{
    public class FormationService : IFormationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public FormationService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            this._mapper = mapper;
            this._unitOfWork = unitOfWork;

        }

        public async Task<ServiceResponse<List<FormationDto>>> fetchAllFormations()
        {
            var serviceResponse = new ServiceResponse<List<FormationDto>>();
            try
            {
                serviceResponse.Data = await this._unitOfWork.Repository<Formation>()
                    .Query()
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