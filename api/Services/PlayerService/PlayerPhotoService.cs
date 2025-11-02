using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using static api.Services.PlayerService.PlayerService;

namespace api.Services.PlayerService
{
    public class PlayerPhotoService : IPlayerPhotoService
    {
        private readonly BlobServiceClient _svc;
        private readonly BlobContainerClient _containerClient;
        private readonly bool _isDev;
        private readonly string _accountName;

        // cache for container SAS used by previews
        private string? _cachedContainerSasQuery;
        private DateTimeOffset _sasExpires;

        public PlayerPhotoService(IConfiguration cfg, IHostEnvironment env)
        {
            _isDev = env.IsDevelopment();

            // Resolve container name (default)
            var containerName = cfg["Storage:Container"] ?? "player-photos";

            if (_isDev)
            {
                // DEV: Azurite (no AAD)
                var cs = cfg["Storage:ConnectionString"] ?? "UseDevelopmentStorage=true";
                _svc = new BlobServiceClient(cs);
                _containerClient = _svc.GetBlobContainerClient(containerName);
                _accountName = _svc.AccountName;
            }
            else
            {
                // PROD: Managed Identity + account URL
                var accountUrl = cfg["Storage:AccountUrl"]
                    ?? throw new InvalidOperationException("Storage:AccountUrl missing in Production.");
                _svc = new BlobServiceClient(new Uri(accountUrl), new DefaultAzureCredential());
                _containerClient = _svc.GetBlobContainerClient(containerName);
                _accountName = _svc.AccountName;
            }
        }

        public async Task<(Uri uploadUrl, string blobName)> CreateUploadSasAsync(int playerId, string contentType, TimeSpan ttl)
        {
            // choose your naming convention; keep extension if you want
            var blobName = $"players/{playerId}.jpg";
            var blobClient = _containerClient.GetBlobClient(blobName);

            if (_isDev)
            {
                // In Azurite, easiest is to upload directly without SAS (SDK call).
                // For brevity, mint a SAS here using SharedKey underneath.
                return (await BuildPerBlobSasAsync(blobClient, BlobSasPermissions.Create | BlobSasPermissions.Write, ttl),
                        blobName);
            }
            else
            {
                // Managed Identity path — use User Delegation Key to mint a per-blob SAS
                return (await BuildPerBlobSasAsync(blobClient, BlobSasPermissions.Create | BlobSasPermissions.Write, ttl),
                        blobName);
            }
        }

        public async Task<Uri> CreateReadSasAsync(string blobName, TimeSpan ttl)
        {
            var blobClient = _containerClient.GetBlobClient(blobName);
            return await BuildPerBlobSasAsync(blobClient, BlobSasPermissions.Read, ttl);
        }

        public async Task<bool> VerifyBlobExistsAsync(string blobName)
        {
            var blob = _containerClient.GetBlobClient(blobName);
            var res = await blob.ExistsAsync();
            return res.Value;
        }

        /// <summary>
        /// Returns preview URLs for many blobs. In dev (Azurite/public) returns plain URLs.
        /// In prod (private) returns URLs with a single cached container SAS query string.
        /// </summary>
        public async Task<IReadOnlyDictionary<int, Uri>> BuildPreviewUrlsAsync(PlayerBlobRef[] playerBlobRefs, TimeSpan ttl, CancellationToken ct = default)
        {
            var baseUri = _containerClient.Uri.ToString();

            //if the baseuri does not end with a slash it will replace that text with the blob name
            // so if the container is the end with no / it will removed so to prevent add slash 
            if (!baseUri.EndsWith("/"))
                baseUri += "/";

            if (_isDev && _containerClient.Uri.Scheme == Uri.UriSchemeHttp)
            {
                // Azurite (often public or dev-only): no SAS needed
                return playerBlobRefs.Select(n => new
                {
                    Key = n.Id,
                    Value = new Uri(new Uri(baseUri), n.PhotoBlobName)
                })
                .ToDictionary(k => k.Key, v => v.Value);
            }

            // Prod/private: use one container SAS for all images on the page
            var now = DateTimeOffset.UtcNow;
            if (_cachedContainerSasQuery == null || now >= _sasExpires.AddMinutes(-2))
            {
                var startsOn = now.AddMinutes(-5);
                var expiresOn = now.Add(ttl <= TimeSpan.Zero ? TimeSpan.FromMinutes(10) : ttl);

                // Acquire User Delegation Key once
                var udk = await _svc.GetUserDelegationKeyAsync(startsOn, expiresOn, ct);

                var sas = new BlobSasBuilder
                {
                    BlobContainerName = _containerClient.Name,
                    Resource = "c",           // container
                    StartsOn = startsOn,
                    ExpiresOn = expiresOn,
                    Protocol = SasProtocol.Https
                };
                sas.SetPermissions(BlobContainerSasPermissions.Read); // read any blob

                _cachedContainerSasQuery = "?" + sas.ToSasQueryParameters(udk.Value, _accountName).ToString();
                _sasExpires = expiresOn;
            }

            var q = _cachedContainerSasQuery!;
            return playerBlobRefs.Select(n => new
            {
                Key = n.Id,
                Value = new Uri($"{new Uri(new Uri(baseUri), n.PhotoBlobName)}{q}")
            }).ToDictionary(k => k.Key, v => v.Value);
        }

        private async Task<Uri> BuildPerBlobSasAsync(BlobClient blobClient, BlobSasPermissions perms, TimeSpan ttl)
        {
            var now = DateTimeOffset.UtcNow;
            var startsOn = now.AddMinutes(-5);
            var expiresOn = now.Add(ttl <= TimeSpan.Zero ? TimeSpan.FromMinutes(10) : ttl);

            if (_isDev && _containerClient.Uri.Scheme == Uri.UriSchemeHttp)
            {
                // Azurite path — SDK is backed by SharedKey; GenerateSasUri works (works for public, Managed Identity doesn't)
                var b = new BlobSasBuilder
                {
                    BlobContainerName = blobClient.BlobContainerName,
                    BlobName = blobClient.Name,
                    Resource = "b",
                    StartsOn = startsOn,
                    ExpiresOn = expiresOn
                };
                b.SetPermissions(perms);
                return blobClient.GenerateSasUri(b);
            }
            else
            {
                // Managed Identity: use User Delegation Key
                var udk = await _svc.GetUserDelegationKeyAsync(startsOn, expiresOn);
                var b = new BlobSasBuilder
                {
                    BlobContainerName = blobClient.BlobContainerName,
                    BlobName = blobClient.Name,
                    Resource = "b",
                    StartsOn = startsOn,
                    ExpiresOn = expiresOn,
                    Protocol = SasProtocol.Https
                };
                b.SetPermissions(perms);
                var q = b.ToSasQueryParameters(udk.Value, _accountName).ToString();
                return new Uri($"{blobClient.Uri}?{q}");
            }
        }

        public async Task<bool> DeleteAsync(string blobName, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(blobName)) return true; // nothing to delete
            var blob = _containerClient.GetBlobClient(blobName);

            // Safe to call repeatedly; includes snapshots if you ever created them
            var result = await blob.DeleteIfExistsAsync(
                DeleteSnapshotsOption.IncludeSnapshots,
                conditions: null,
                cancellationToken: ct);

            return result.Value;
        }
    }
}