using backend.Context;
using backend.Custom;
using backend.Models.DTOs;
using backend.Services.Interfaces;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register/admin")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            try
            {
                var rol = "Admin";
                var user = await _authService.CreateAsync(model, rol);
                return Ok(new
                {
                    message = "Usuario creado correctamente.",
                    user = new
                    {
                        user.Id,
                        user.NombreUsuario,
                        user.Cedula,
                        user.Rol
                    }
                });

            }
            catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("register/user")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterDTO model)
        {
            try
            {
                var rol = "User";
                var user = await _authService.CreateAsync(model, rol);
                return Ok(new
                {
                    message = "Usuario creado correctamente.",
                    user = new
                    {
                        user.Id,
                        user.NombreUsuario,
                        user.Cedula,
                        user.Rol
                    }
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            try
            {
                var token = await _authService.LoginAsync(model);

                if (token == null)
                    return Unauthorized(new { message = "Cédula o contraseña incorrecta." });

                return Ok(new
                {
                    message = "Inicio de sesión exitoso.",
                    token = token
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
