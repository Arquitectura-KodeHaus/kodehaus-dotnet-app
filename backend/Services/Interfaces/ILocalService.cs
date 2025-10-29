using backend.Models;

namespace backend.Services.Interfaces;

public interface ILocalService
{
    Task<IEnumerable<Local>> GetAllAsync();
    Task<Local?> GetByIdAsync(int id);
    Task<Local> CreateAsync(Local local);
    Task<Local?> UpdateAsync(int id, Local local);
    Task<bool> DeleteAsync(int id);
}
