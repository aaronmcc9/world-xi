using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.Dto;
using api.Services.AuthService;
using api.Dto.User;
using api.Models;

namespace api.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService)
    {
      this._authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ServiceResponse<string>>> Register(UserRequestDto user)
    {
      var response = await this._authService.Register(new User { Email = user.Email }, user.Password);

      if (!response.Success)
        return BadRequest(response.Message);

      return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<ServiceResponse<string>>> Login(UserRequestDto user)
    {
      var response = await this._authService.Login(user.Email, user.Password);

      if (!response.Success)
        return BadRequest(response);

      return Ok(response);
    }


  }
}