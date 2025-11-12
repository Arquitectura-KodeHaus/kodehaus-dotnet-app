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

                Console.WriteLine($"🔄 Redirecting login to: {loginUrl}");
                Console.WriteLine($"📤 Login data - Cedula: {login.Cedula}");

                // ✅ ADAPTACIÓN: Mapear cedula a username para el servicio Java
                var loginRequest = new
                {
                    username = login.Cedula,  // Java espera "username"
                    password = login.Contrasena
                };

                var jsonContent = JsonSerializer.Serialize(loginRequest);
                Console.WriteLine($"📦 JSON Request: {jsonContent}");
                
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(loginUrl, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"📥 Response Status: {response.StatusCode}");
                Console.WriteLine($"📥 Response Content: {responseContent}");

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"❌ Login failed - Status: {response.StatusCode}, Response: {responseContent}");
                    return null;
                }

                var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);

                // ✅ El servicio Java retorna "accessToken" no "token"
                if (jsonResponse.TryGetProperty("accessToken", out var tokenElement))
                {
                    var token = tokenElement.GetString();
                    Console.WriteLine($"✅ Login successful - Token received");
                    return token;
                }

                Console.WriteLine($"⚠️ No accessToken found in response");
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 Exception during login: {ex.Message}");
                Console.WriteLine($"💥 StackTrace: {ex.StackTrace}");
                return null;
            }
        }

    }
}
