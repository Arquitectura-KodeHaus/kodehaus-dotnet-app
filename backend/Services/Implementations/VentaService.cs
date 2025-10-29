using backend.Context;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations;

public class VentaService: IVentaService
{
    private readonly AppDbContext _context;

    public VentaService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<IEnumerable<Venta>> GetAllAsync() =>
        await _context.Ventas
            .Include(v => v.Local)
            .Include(v => v.VentaInventarios)!
            .ThenInclude(vi => vi.Inventario)
            .ToListAsync();
    public async Task<Venta?> GetByIdAsync(int id) =>
        await _context.Ventas
            .Include(v => v.Local)
            .Include(v => v.VentaInventarios)!
            .ThenInclude(vi => vi.Inventario)
            .FirstOrDefaultAsync(v => v.Id == id);
    public async Task<Venta> CreateAsync(Venta venta)
    {
        venta.Fecha = DateTime.UtcNow;
        if (venta.VentaInventarios == null || !venta.VentaInventarios.Any())
            throw new Exception("La venta debe tener al menos un producto.");
        decimal total = 0;
        foreach (var item in venta.VentaInventarios)
        {
            var inventario = await _context.Inventarios.FindAsync(item.IdInventario);
            if (inventario == null)
                throw new Exception($"Inventario con ID {item.IdInventario} no existe.");
            if (item.Cantidad <= 0)
                throw new Exception("La cantidad debe ser mayor a cero.");
            if (inventario.Stock < item.Cantidad)
                throw new Exception($"No hay suficiente stock para el inventario {inventario.Id}.");
            item.Subtotal = inventario.PrecioUnitario * item.Cantidad;
            inventario.Stock -= item.Cantidad;
            total += item.Subtotal;
        }
        venta.Total = total;
        _context.Ventas.Add(venta);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            // Detectar error por clave foránea (23503 es el código en PostgreSQL)
            if (ex.InnerException is Npgsql.PostgresException pgEx && pgEx.SqlState == "23503")
            {
                throw new Exception("El local especificado no existe. Verifica el campo 'idLocal'.");
            }
            // Si es otro tipo de error de base de datos
            throw new Exception("Error al guardar la venta en la base de datos.");
        }
        return venta;
    }

}
