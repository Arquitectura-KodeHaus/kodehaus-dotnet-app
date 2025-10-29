using backend.Models;

namespace backend.Services.Interfaces;

public interface IVentaService
{
    Task<IEnumerable<Venta>> GetAllAsync();
    Task<Venta?> GetByIdAsync(int id);
    Task<Venta> CreateAsync(Venta venta);
}
