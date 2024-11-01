using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.User;
using api.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace api.Services.AuthService
{
  public class AuthService : IAuthService
  {

    private readonly DataContext _dataContext;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AuthService(DataContext dataContext, IMapper mapper, IConfiguration configuration)
    {
      this._dataContext = dataContext;
      this._mapper = mapper;
      this._configuration = configuration;

    }
    public async Task<ServiceResponse<string>> Login(string email, string password)
    {
      var serviceResponse = new ServiceResponse<string>();

      try
      {
        var user = await this._dataContext.User
          .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

        if (user == null || !this.VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
        {
          serviceResponse.Success = false;
          serviceResponse.Message = "The credentials provided do not match our records!";
          return serviceResponse;
        }

        serviceResponse.Data = this.CreateToken(user);
        serviceResponse.Message = "User successfully logged in!";
      }
      catch (Exception e)
      {
        serviceResponse.Success = false;
        serviceResponse.Message = e.Message;
      }

      return serviceResponse;
    }


    public async Task<ServiceResponse<string>> Register(User user, string password)
    {
      var serviceResponse = new ServiceResponse<string>();

      try
      {

        var exists = await this.UserExists(user.Email);

        if (exists)
        {
          serviceResponse.Success = false;
          serviceResponse.Message = "User already exists";
          return serviceResponse;
        }

        this.CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);
        user.PasswordHash = passwordHash;
        user.PasswordSalt = passwordSalt;

        this._dataContext.User.Add(user);
        await this._dataContext.SaveChangesAsync();

        serviceResponse.Data = this.CreateToken(user);
        serviceResponse.Message = "User successfully registered!";
      }
      catch (Exception e)
      {
        serviceResponse.Success = false;
        serviceResponse.Message = e.Message;
      }

      return serviceResponse;
    }

    public async Task<bool> UserExists(string email)
    {
      return await this._dataContext.User.AnyAsync(u => u.Email.ToLower() == email.ToLower());
    }

    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
      using (var hmac = new System.Security.Cryptography.HMACSHA512())
      {
        passwordSalt = hmac.Key;
        passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
      }
    }

    private string CreateToken(User user)
    {
      List<Claim> claims = new List<Claim>{
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Email)
      };

      SymmetricSecurityKey key = new SymmetricSecurityKey(System.Text.Encoding.UTF8
        .GetBytes(_configuration.GetSection("AppSettings:Token").Value));

      SigningCredentials credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

      SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.Now.AddHours(8),
        SigningCredentials = credentials
      };

      JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
      SecurityToken securityToken = tokenHandler.CreateToken(tokenDescriptor);

      return tokenHandler.WriteToken(securityToken);
    }

    private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
    {
      using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
      {
        var computeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        return computeHash.SequenceEqual(passwordHash);
      }
    }
  }
}