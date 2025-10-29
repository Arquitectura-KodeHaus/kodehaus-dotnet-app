using backend.Models;

namespace backend.Services.Interfaces;

public interface IInventarioService
{
    Task<IEnumerable<Inventario>> GetAllAsync();
    Task<Inventario?> GetByIdAsync(int id);
    Task<Inventario?> CreateAsync(Inventario inventario);
    Task<Inventario?> UpdateAsync(int id, Inventario inventario);
    Task<bool> DeleteAsync(int id);
}
