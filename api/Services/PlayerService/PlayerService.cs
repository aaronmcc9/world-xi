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
        private readonly IPlayerPhotoService _playerPhotoService;
        public record PlayerBlobRef(int Id, string PhotoBlobName);



        public PlayerService(IMapper mapper, IUnitOfWork unitOfWork, IPlayerPhotoService playerPhotoService)
        {
            this._mapper = mapper;
            this.unitOfWork = unitOfWork;
            this._playerPhotoService = playerPhotoService;
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
                var playersQuery = this.Query()
                    .Select(p => this._mapper.Map<PlayerDto>(p));

                var total = await playersQuery.CountAsync();

                if (take.HasValue)
                    playersQuery = playersQuery.Take(take.Value);

                if (skip.HasValue)
                    playersQuery = playersQuery.Skip(skip.Value);

                var players = await playersQuery
                    .Select(p => this._mapper.Map<PlayerDto>(p))
                    .ToListAsync();

                response.Data = new PagedResponseDto<PlayerDto>
                {
                    Total = total,
                    Items = await this.getPlayerPhotoPreviewUrls(players)
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

                if (response.Data.PhotoBlobName != null)
                    response.Data.PhotoUrl = (await this._playerPhotoService.BuildPreviewUrlsAsync(new[] { new PlayerBlobRef(response.Data.Id, response.Data.PhotoBlobName) }, TimeSpan.FromMinutes(30))).First().Value.ToString();
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
                var playersQuery = this.Query()
                  .Where(p => p.Position == (Models.PlayerPosition)position);

                var total = await playersQuery.CountAsync();

                if (take.HasValue)
                    playersQuery = playersQuery

                    .Take(take.Value);

                if (skip.HasValue)
                    playersQuery = playersQuery.Skip(skip.Value);

                var players = await playersQuery
                    .Select(p => this._mapper.Map<PlayerDto>(p))
                    .ToListAsync();

                response.Data = new PagedResponseDto<PlayerDto>
                {
                    Total = total,
                    Items = await this.getPlayerPhotoPreviewUrls(players)
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

                var players = await this.Query()
                  .Select(p => this._mapper.Map<PlayerDto>(p))
                  .ToListAsync();

                //get the player display urls
                response.Data = await this.getPlayerPhotoPreviewUrls(players);
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
                var playerToDelete = await this.Query()
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (playerToDelete == null)
                {
                    response.Success = false;
                    response.Message = "Player not found";
                    return response;
                }

                //Delete the blob first so failures don't orphan it
                var deleted = await _playerPhotoService.DeleteAsync(playerToDelete.PhotoBlobName);

                await this.unitOfWork.Repository<Player>().DeleteAsync(playerToDelete);

                var players = await this.Query()
                  .Select(p => this._mapper.Map<PlayerDto>(p))
                  .ToListAsync();

                response.Data = await this.getPlayerPhotoPreviewUrls(players);
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        private async Task<List<PlayerDto>> getPlayerPhotoPreviewUrls(List<PlayerDto> players)
        {
            var playerBlobNames = players
                .Where(p => !string.IsNullOrEmpty(p.PhotoBlobName))
                .Select(p => new PlayerBlobRef(p.Id, p.PhotoBlobName!)).ToArray();
            var previewUrlsDict = await this._playerPhotoService.BuildPreviewUrlsAsync(playerBlobNames!, TimeSpan.FromMinutes(30));

            //assign urls back to players
            foreach (var player in players)
            {
                if (previewUrlsDict.TryGetValue(player.Id, out var previewUrl))
                {
                    player.PhotoUrl = previewUrl.ToString();
                }
            }

            return players;
        }
    }
}