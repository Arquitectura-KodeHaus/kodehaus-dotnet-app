using backend.Custom;
using backend.Models;
using backend.Models.DTOs;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using backend.Context;

namespace backend.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly Utils _utils;
        private readonly ILogger<AuthService> _logger;

        public AuthService(AppDbContext context, Utils utils, ILogger<AuthService> logger)
        {
            _context = context;
            _utils = utils;
            _logger = logger;
        }

        public async Task<Usuario> CreateAsync(RegisterDTO usuario, string rol)
        {
            var exists = await _context.Usuarios.AnyAsync(u => u.Cedula == usuario.Cedula);
            if (exists)
            {
                throw new Exception("Ya existe un usuario con esa cédula.");
            }

            var localExists = await _context.Locales.AnyAsync(l => l.Id == usuario.IdLocal);
            if (!localExists)
            {
                throw new Exception("El local asignado no existe.");
            }

            var newUser = new Usuario
            {
                NombreUsuario = usuario.NombreUsuario,
                Contrasena = _utils.encryptPassword(usuario.Contrasena),
                Cedula = usuario.Cedula,
                Rol = rol,
                IdLocal = usuario.IdLocal
            };

                _context.Usuarios.Add(nuevoUsuario);
                await _context.SaveChangesAsync();

                _logger.LogInformation("✅ User registered successfully: {Username}", nuevoUsuario.NombreUsuario);
                return nuevoUsuario;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error during registration");
                throw;
            }
        }
    }
}
