using backend.Models;
using backend.Models.DTOs;

namespace backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<Usuario> CreateAsync(RegisterDTO usuario, String rol);
        Task<string?> LoginAsync(LoginDTO login);
    }
}
