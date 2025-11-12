using backend.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Custom
{
    public class Utils
    {
        private readonly IConfiguration _configuration;
        public Utils(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string encryptPassword(string password)
        {
            // Simple hash for demonstration purposes. Use a stronger hashing algorithm in production.
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = System.Text.Encoding.UTF8.GetBytes(password);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }

        public string generateJwtSecret(Usuario modelo)
        {
            var claims = new[]
            {
                new Claim("Cedula", modelo.Cedula),
                new Claim(ClaimTypes.Role, modelo.Rol),
                new Claim("IdLocal", modelo.IdLocal.ToString())
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var jwtConfig = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(jwtConfig);


        }
    }
}
