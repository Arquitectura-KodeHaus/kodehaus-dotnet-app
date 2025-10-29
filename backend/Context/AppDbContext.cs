using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Context;

public class AppDbContext: DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }
    
    public DbSet<Local> Locales { get; set; }
    public DbSet<Venta> Ventas { get; set; }
    public DbSet<Inventario> Inventarios { get; set; }
    public DbSet<VentaInventario> VentaInventarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<VentaInventario>()
            .HasKey(vi => new { vi.IdVenta, vi.IdInventario });
    }

}
