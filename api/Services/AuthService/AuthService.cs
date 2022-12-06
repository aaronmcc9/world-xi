using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Models;

namespace api.Services.AuthService
{
  public class AuthService : IAuthService
  {
    public Task<ServiceResponse<string>> Login(string username, string password)
    {
      throw new NotImplementedException();
    }

    public Task<ServiceResponse<int>> Register(User user, string password)
    {
      throw new NotImplementedException();
    }

    public Task<bool> UserExists(string username)
    {
      throw new NotImplementedException();
    }
  }
}