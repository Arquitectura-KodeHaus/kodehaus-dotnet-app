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

        [Authorize(Roles = "Admin")]
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
                Console.WriteLine($"🎯 AuthController - Login request received");
                Console.WriteLine($"📋 Model - Cedula: {model?.Cedula}, Contrasena length: {model?.Contrasena?.Length}");
                
                if (model == null)
                {
                    Console.WriteLine("❌ Model is null");
                    return BadRequest(new { message = "Datos de login inválidos." });
                }

                if (string.IsNullOrEmpty(model.Cedula) || string.IsNullOrEmpty(model.Contrasena))
                {
                    Console.WriteLine("❌ Cedula or Contrasena is empty");
                    return BadRequest(new { message = "Cédula y contraseña son requeridos." });
                }

                var token = await _authService.LoginAsync(model);

                if (token == null)
                {
                    Console.WriteLine("❌ Token is null - Login failed");
                    return Unauthorized(new { message = "Cédula o contraseña incorrecta." });
                }

                Console.WriteLine("✅ Login successful in controller");
                return Ok(new
                {
                    message = "Inicio de sesión exitoso.",
                    token = token
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 Exception in AuthController: {ex.Message}");
                Console.WriteLine($"💥 StackTrace: {ex.StackTrace}");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
