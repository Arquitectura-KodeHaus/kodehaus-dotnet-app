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

        public async Task<Usuario?> Login(LoginDTO loginDto)
        {
            try
            {
                _logger.LogInformation("🔐 Login attempt for Cedula: {Cedula}", loginDto.Cedula);
                
                // Encriptar la contraseña recibida
                var passwordEncriptada = _utils.encriptarSHA256(loginDto.Contrasena);
                _logger.LogInformation("🔑 Password hash generated: {Hash}", passwordEncriptada?.Substring(0, 20) + "...");

                // Buscar usuario por cédula
                var usuario = await _context.Usuarios
                    .Include(u => u.Local)
                    .FirstOrDefaultAsync(u => u.Cedula == loginDto.Cedula);

                if (usuario == null)
                {
                    _logger.LogWarning("❌ User not found for Cedula: {Cedula}", loginDto.Cedula);
                    return null;
                }

                _logger.LogInformation("👤 User found: {Username}, Role: {Role}", usuario.NombreUsuario, usuario.Rol);
                _logger.LogInformation("🔑 Stored hash: {Hash}", usuario.Contrasena?.Substring(0, 20) + "...");

                // Comparar contraseñas
                if (usuario.Contrasena == passwordEncriptada)
                {
                    _logger.LogInformation("✅ Login successful for user: {Username}", usuario.NombreUsuario);
                    return usuario;
                }
                else
                {
                    _logger.LogWarning("❌ Password mismatch for user: {Username}", usuario.NombreUsuario);
                    return null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error during login for Cedula: {Cedula}", loginDto.Cedula);
                throw;
            }
        }

        public async Task<Usuario?> RegisterAdmin(RegisterDTO registerDto)
        {
            return await Register(registerDto, "Admin");
        }

        public async Task<Usuario?> RegisterUser(RegisterDTO registerDto)
        {
            return await Register(registerDto, "User");
        }

        private async Task<Usuario?> Register(RegisterDTO registerDto, string rol)
        {
            try
            {
                _logger.LogInformation("📝 Register attempt - Username: {Username}, Cedula: {Cedula}, Role: {Role}", 
                    registerDto.NombreUsuario, registerDto.Cedula, rol);

                // Verificar si ya existe un usuario con esa cédula
                var usuarioExistente = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Cedula == registerDto.Cedula);

                if (usuarioExistente != null)
                {
                    _logger.LogWarning("⚠️ User already exists with Cedula: {Cedula}", registerDto.Cedula);
                    return null;
                }

                // Verificar que el local existe
                var localExists = await _context.Locales.AnyAsync(l => l.Id == registerDto.IdLocal);
                if (!localExists)
                {
                    _logger.LogWarning("⚠️ Local not found with Id: {IdLocal}", registerDto.IdLocal);
                    throw new Exception("El local asignado no existe.");
                }

                // Encriptar contraseña
                var passwordEncriptada = _utils.encriptarSHA256(registerDto.Contrasena);
                _logger.LogInformation("🔑 Password encrypted for new user");

                var nuevoUsuario = new Usuario
                {
                    NombreUsuario = registerDto.NombreUsuario,
                    Contrasena = passwordEncriptada,
                    Cedula = registerDto.Cedula,
                    Rol = rol,
                    IdLocal = registerDto.IdLocal
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
