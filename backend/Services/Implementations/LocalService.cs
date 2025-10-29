using backend.Context;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations;

public class LocalService: ILocalService
{
    private readonly AppDbContext _context;

    public LocalService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<IEnumerable<Local>> GetAllAsync()
    {
        return await _context.Locales.ToListAsync();
    }
    public async Task<Local?> GetByIdAsync(int id)
    {
        return await _context.Locales.FindAsync(id);
    }
    public async Task<Local> CreateAsync(Local local)
    {
        _context.Locales.Add(local);
        await _context.SaveChangesAsync();
        return local;
    }
    public async Task<Local?> UpdateAsync(int id, Local local)
    {
        var existing = await _context.Locales.FindAsync(id);
        if (existing == null) return null;
        existing.Nombre = local.Nombre;
        existing.Categoria = local.Categoria;
        existing.NumeroLocal = local.NumeroLocal;
        existing.Estado = local.Estado;
        await _context.SaveChangesAsync();
        return existing;
    }
    public async Task<bool> DeleteAsync(int id)
    {
        var local = await _context.Locales.FindAsync(id);
        if (local == null) return false;
        _context.Locales.Remove(local);
        await _context.SaveChangesAsync();
        return true;
    }
}
