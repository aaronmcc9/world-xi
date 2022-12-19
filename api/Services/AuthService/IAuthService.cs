using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.User;
using api.Models;

namespace api.Services.AuthService
{
    public interface IAuthService
    {
        Task<ServiceResponse<UserDto>> Register(User user, string password);
        Task<ServiceResponse<UserDto>> Login(string email, string password);
        Task<bool> UserExists(string email);
    }
}