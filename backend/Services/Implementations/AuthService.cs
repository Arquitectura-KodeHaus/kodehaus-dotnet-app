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

            _context.Usuarios.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }


        public async Task<string?> LoginAsync(LoginDTO login)
        {
            try
            {
                var gestionPlazasUrl = _configuration["ServiceUrls:GestionPlazasUrl"];
                var loginUrl = $"{gestionPlazasUrl}/api/auth/login";

                var jsonContent = JsonSerializer.Serialize(login);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(loginUrl, content);

                if (!response.IsSuccessStatusCode)
                    return null;

                var responseContent = await response.Content.ReadAsStringAsync();
                var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);

                // Extraer el token de la respuesta
                if (jsonResponse.TryGetProperty("token", out var tokenElement))
                {
                    return tokenElement.GetString();
                }

                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }

    }
}
