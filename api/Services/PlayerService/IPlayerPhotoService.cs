using static api.Controllers.PlayerController;

public interface IPlayerPhotoService
{
    Task<(Uri uploadUrl, string blobName)> CreateUploadSasAsync(int playerId, string contentType, TimeSpan ttl);
    Task<Uri> CreateReadSasAsync(string blobName, TimeSpan ttl);
    Task<bool> VerifyBlobExistsAsync(string blobName);
    Task<IReadOnlyDictionary<int, Uri>> BuildPreviewUrlsAsync(PlayerBlobRef[] playerBlobRefs, TimeSpan ttl, CancellationToken ct = default);

}