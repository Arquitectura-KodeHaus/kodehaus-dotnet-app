using System;
using backend.Context;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations;

public class InventarioService: IInventarioService
{
    private readonly AppDbContext _context;
    public InventarioService(AppDbContext context)
    {
        _context = context;
    }

    private async Task<bool> LocalExists(int idLocal)
    {
        return await _context.Locales.AnyAsync(l => l.Id == idLocal);
    }

    public async Task<IEnumerable<Inventario>> GetAllAsync() =>
        await _context.Inventarios.Include(i => i.Local).ToListAsync();
    public async Task<Inventario?> GetByIdAsync(int id) =>
        await _context.Inventarios.Include(i => i.Local)
                                  .FirstOrDefaultAsync(i => i.Id == id);
    public async Task<Inventario?> CreateAsync(Inventario inventario)
    {
        if(!await LocalExists(inventario.IdLocal))
        {
            return null;
        }
        _context.Inventarios.Add(inventario);
        await _context.SaveChangesAsync();
        var nuevoInventarioConLocal = await _context.Inventarios
            .Include(i => i.Local) 
            .FirstOrDefaultAsync(i => i.Id == inventario.Id);
        return nuevoInventarioConLocal;
    }
    public async Task<Inventario?> UpdateAsync(int id, Inventario inventario)
    {
        var existing = await _context.Inventarios.FindAsync(id);
        if (existing == null) return null;

        if (existing.IdLocal != inventario.IdLocal) 
        {
            if (!await LocalExists(inventario.IdLocal))
            {
                return null;
            }
        }
        
        existing.IdLocal = inventario.IdLocal; 
        existing.IdProductoCatalogo = inventario.IdProductoCatalogo;
        existing.PrecioUnitario = inventario.PrecioUnitario;
        existing.Stock = inventario.Stock;
        
        await _context.SaveChangesAsync();

        var inventarioActualizado = await _context.Inventarios
            .Include(i => i.Local)
            .FirstOrDefaultAsync(i => i.Id == existing.Id);

        return inventarioActualizado;
    }
    public async Task<bool> DeleteAsync(int id)
    {
        var inventario = await _context.Inventarios.FindAsync(id);
        if (inventario == null) return false;
        _context.Inventarios.Remove(inventario);
        await _context.SaveChangesAsync();
        return true;
    }

}
