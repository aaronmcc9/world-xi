using System.Text.Json.Serialization;
using api;
using api.Dal;
using api.Dal.Contracts.Common;
using api.Services.AuthService;
using api.Services.FormationService;
using api.Services.FriendRequestService;
using api.Services.NotificationService;
using api.Services.PlayerService;
using api.Services.TeamService;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Environment.IsProduction()
    ? builder.Configuration.GetConnectionString("DefaultConnection") // from App Service config
    : builder.Configuration.GetConnectionString("DevConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Connection string is not configured.");
}

builder.Services.AddDbContextPool<DataContext>(options =>
{
    options.UseSqlServer(connectionString, sql =>
    {
        sql.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(15), errorNumbersToAdd: null);
        sql.CommandTimeout(60);
    });

    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging(true);
        options.EnableDetailedErrors(true);
    }
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(type => type.ToString());
});
builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8
                .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });
builder.Services.AddControllersWithViews()
                .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IPlayerService, PlayerService>();
builder.Services.AddScoped<IPlayerPhotoService, PlayerPhotoService>();
builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFormationService, FormationService>();
builder.Services.AddScoped<IFriendRequestService, FriendRequestService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();



// 1) Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", p => p
        .WithOrigins("http://localhost:4200", "http://localhost:56435")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .SetPreflightMaxAge(TimeSpan.FromHours(12)));

    options.AddPolicy("ProdCors", p => p
        .WithOrigins(
            "https://world-xi-cgbndraeeab5h9eb.canadacentral-01.azurewebsites.net")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .SetPreflightMaxAge(TimeSpan.FromHours(12)));
});

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //below code gives Azurite CORS permissions for localhost:4200
    try
    {
        var opts = new BlobClientOptions(BlobClientOptions.ServiceVersion.V2019_07_07);
        var svc = new BlobServiceClient(builder.Configuration.GetSection("Storage:ConnectionString").Value, opts);

        var props = await svc.GetPropertiesAsync();
        props.Value.Cors.Clear();
        props.Value.Cors.Add(new BlobCorsRule
        {
            AllowedOrigins = "http://localhost:4200,http://127.0.0.1:4200,http://localhost:56435",
            AllowedMethods = "GET,PUT,HEAD,POST,DELETE,OPTIONS",
            AllowedHeaders = "*",
            ExposedHeaders = "*",
            MaxAgeInSeconds = 3600
        });

        // Apply cors for azurite
        await svc.SetPropertiesAsync(props.Value);

        // Ensure container exists for adding player photos
        var container = svc.GetBlobContainerClient("player-photos");
        await container.CreateIfNotExistsAsync();
        await container.SetAccessPolicyAsync(PublicAccessType.Blob);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Failed to configure Azurite CORS: {ex.Message}");
    }

    app.UseCors("DevCors");
    app.UseSwagger();
    app.UseSwaggerUI();
}
else if (app.Environment.IsProduction())
{
    app.UseCors("ProdCors");
}

// Static files for Angular
app.UseDefaultFiles();   // enables default docs like index.html
app.UseStaticFiles(); // serves files from wwwroot

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
