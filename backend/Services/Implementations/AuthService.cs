using backend.Context;
using backend.Custom;
using backend.Models;
using backend.Models.DTOs;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace backend.Services.Implementations
{
    public class AuthService: IAuthService
    {
        private readonly AppDbContext _context;
        private readonly Utils _utils;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, Utils utils, HttpClient httpClient, IConfiguration configuration)
        {
            _context = context;
            _utils = utils;
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<Usuario> CreateAsync(RegisterDTO usuario, string rol)
        {
            var exists = await _context.Usuarios.AnyAsync(u => u.Cedula == usuario.Cedula);
            if (exists)
            {
                throw new Exception("Ya existe un usuario con ese nombre de usuario.");
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

            _context.Usuarios.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }


        public async Task<string?> LoginAsync(LoginDTO login)
        {
            var user = await _context.Usuarios.FirstOrDefaultAsync(u =>
                u.NombreUsuario == login.Cedula &&
                u.Contrasena == _utils.encryptPassword(login.Contrasena));

            if (user == null)
                return null;

            // Generar el JWT usando Utils
            var token = _utils.generateJwtSecret(user);

            return token;
        }

    }
}
