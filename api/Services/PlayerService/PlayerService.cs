using api.Dal.Contracts.Common;
using api.Dto;
using api.Dto.Common;
using api.Dto.Player;
using api.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PlayerPosition = api.Dto.Player.PlayerPosition;

namespace api.Services.PlayerService
{
    public class PlayerService : IPlayerService
    {
        private readonly IMapper _mapper;
        private IUnitOfWork unitOfWork;

        public PlayerService(IMapper mapper, IUnitOfWork unitOfWork)
        {
            this._mapper = mapper;
            this.unitOfWork = unitOfWork;
        }

        public IQueryable<Player> Query()
        {
            return this.unitOfWork.Repository<Player>()
                .Query(null, (p) => p.OrderBy(p => p.FirstName)
                .ThenBy(p => p.LastName));
        }

        public async Task<ServiceResponse<PagedResponseDto<PlayerDto>>> FetchAllPlayers(int? skip, int? take)
        {
            var response = new ServiceResponse<PagedResponseDto<PlayerDto>>();

            try
            {
                var players = this.Query()
                    .Select(p => this._mapper.Map<PlayerDto>(p));

                var total = await players.CountAsync();

                if (take.HasValue)
                    players = players.Take(take.Value);

                if (skip.HasValue)
                    players = players.Skip(skip.Value);


                response.Data = new PagedResponseDto<PlayerDto>
                {
                    Total = total,
                    Items = await players.ToListAsync()
                };

                return response;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<PlayerDto>> FetchPlayerById(int id)
        {
            var response = new ServiceResponse<PlayerDto>();
            try
            {
                var player = await this.Query()
                    .FirstOrDefaultAsync(p => p.Id == id); 

                if (player == null)
                {
                    response.Success = false;
                    response.Message = "Could not find Player!";
                    return response;
                }
                response.Data = this._mapper.Map<PlayerDto>(player);
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<PagedResponseDto<PlayerDto>>> FetchPlayerByPosition(PlayerPosition position, int? skip, int? take)
        {
            var response = new ServiceResponse<PagedResponseDto<PlayerDto>>();

            try
            {
                var players = this.Query()
                  .Where(p => p.Position == (Models.PlayerPosition)position);

                var total = await players.CountAsync();

                if (take.HasValue)
                    players = players

                    .Take(take.Value);

                if (skip.HasValue)
                    players = players.Skip(skip.Value);

                response.Data = new PagedResponseDto<PlayerDto>
                {
                    Total = total,
                    Items = await players
                    .Select(p => this._mapper.Map<PlayerDto>(p))
                    .ToListAsync()
                };
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<PlayerDto>> InsertPlayer(PlayerDto newPlayer)
        {
            var response = new ServiceResponse<PlayerDto>();

            try
            {
                var player = this._mapper.Map<Player>(newPlayer);
                await this.unitOfWork.Repository<Player>().CreateAsync(player);

                response.Data = this._mapper.Map<PlayerDto>(player);
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<List<PlayerDto>>> UpdatePlayer(PlayerDto playerToUpdate)
        {
            var response = new ServiceResponse<List<PlayerDto>>();

            try
            {
                var player = this._mapper.Map<Player>(playerToUpdate);
                await this.unitOfWork.Repository<Player>().UpdateAsync(player);

                response.Data = await this.Query()
                  .Select(p => this._mapper.Map<PlayerDto>(p))
                  .ToListAsync();
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<List<PlayerDto>>> DeletePlayer(int id)
        {
            var response = new ServiceResponse<List<PlayerDto>>();

            try
            {
                var playerToDelete = this.Query()
                  .Where(p => p.Id == id)
                  .FirstOrDefault();

                if (playerToDelete == null)
                {
                    response.Success = false;
                    response.Message = "Player not found";
                    return response;
                }

                var player = this._mapper.Map<Player>(playerToDelete);
                await this.unitOfWork.Repository<Player>().DeleteAsync(player);

                response.Data = await this.Query()
                  .Select(p => this._mapper.Map<PlayerDto>(p))
                  .ToListAsync();
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }
    }
}