using static api.Services.PlayerService.PlayerService;

public interface IPlayerPhotoService
{
    Task<(Uri uploadUrl, string blobName)> CreateUploadSasAsync(int playerId, string contentType, TimeSpan ttl);
    Task<Uri> CreateReadSasAsync(string blobName, TimeSpan ttl);
    Task<bool> VerifyBlobExistsAsync(string blobName);
    Task<IReadOnlyDictionary<int, Uri>> BuildPreviewUrlsAsync(PlayerBlobRef[] playerBlobRefs, TimeSpan ttl, CancellationToken ct = default);
    Task<bool> DeleteAsync(string blobName, CancellationToken ct = default);

}