using api.Dto;
using api.Dto.Common;
using api.Dto.Player;
using api.Services.PlayerService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayerController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly IPlayerService _playerService;
        private readonly IPlayerPhotoService _playerPhotoService;

        public record PlayerBlobRef(int Id, string PhotoBlobName);
        public record BlobSASRef(string uploadUrl, string PhotoBlobName);


        public PlayerController(DataContext dataContext, IPlayerService playerService, IPlayerPhotoService playerPhotoService)
        {
            this._playerService = playerService;
            this._dataContext = dataContext;
            this._playerPhotoService = playerPhotoService;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<PagedResponseDto<PlayerDto>>>> FetchAllPlayers(int? skip, int? take)
        {
            var response = await this._playerService.FetchAllPlayers(skip, take);

            if (response.Data == null)
                return NotFound(response);

            var playerBlobNames = response.Data.Items.Select(p => new PlayerBlobRef(p.Id, p.PhotoBlobName)).ToArray();
            var previewUrlsDict = await this._playerPhotoService.BuildPreviewUrlsAsync(playerBlobNames.ToArray(), TimeSpan.FromMinutes(30));

            //assign urls back to players
            foreach (var player in response.Data.Items)
            {
                if (previewUrlsDict.TryGetValue(player.Id, out var previewUrl))
                {
                    player.PhotoUrl = previewUrl.ToString();
                }
            }

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<PlayerDto>>> FetchPlayerById(int id)
        {
            var response = await this._playerService.FetchPlayerById(id);

            if (response.Data == null)
                return NotFound(response);

            var previewUrlsDict = await this._playerPhotoService.BuildPreviewUrlsAsync(new PlayerBlobRef[] { new PlayerBlobRef(response.Data.Id, response.Data.PhotoBlobName) }, TimeSpan.FromMinutes(30));
            response.Data.PhotoUrl = previewUrlsDict[response.Data.Id].ToString();
            return Ok(response);
        }

        [HttpGet("position")]
        public async Task<ActionResult<ServiceResponse<PagedResponseDto<PlayerDto>>>> FetchPlayerByPosition(PlayerPosition position, int? skip,
          int? take)
        {
            var response = await this._playerService.FetchPlayerByPosition(position, skip, take);

            if (response.Data == null)
                return NotFound(response);

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<List<PlayerDto>>>> InsertPlayer(PlayerDto newPlayer)
        {
            var response = await this._playerService.InsertPlayer(newPlayer);
            return Ok(response);
        }

        [HttpPost("{id:int}/photo/sas")]
        public async Task<ActionResult<ServiceResponse<BlobSASRef>>> GetUploadSas(int id, [FromQuery] string contentType = "image/jpeg")
        {
            var response = new ServiceResponse<BlobSASRef>();

            var existingPlayer = await this._playerService.Query()
                .AnyAsync(p => p.Id == id);

            if (!existingPlayer)
            {
                response.Message = "Player not found";
                response.Success = false;
                return NotFound(response);
            }

            var (uploadUrl, blobName) = await this._playerPhotoService.CreateUploadSasAsync(id, contentType, TimeSpan.FromMinutes(5));
            response.Data = new BlobSASRef(uploadUrl.ToString(), blobName);
            return Ok(response);
        }


        [HttpPut("{id:int}/photo")]
        public async Task<IActionResult> SavePhoto(int id, [FromBody] PhotoDto dto)
        {
            var existingPlayer = await this._playerService.Query()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existingPlayer == null)
                return NotFound("Player not found");

            if (!await this._playerPhotoService.VerifyBlobExistsAsync(dto.BlobName))
                return BadRequest("Upload not found. Please retry.");

            existingPlayer.PhotoBlobName = dto.BlobName;
            await this._dataContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut]
        public async Task<ActionResult<ServiceResponse<List<PlayerDto>>>> UpdatePlayer(PlayerDto playerToUpdate)
        {
            return Ok(await this._playerService.UpdatePlayer(playerToUpdate));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<List<PlayerDto>>>> DeletePlayer(int id)
        {
            if (id == 0)
                return NotFound("Player not found");

            return Ok(await this._playerService.DeletePlayer(id));
        }
    }
}
