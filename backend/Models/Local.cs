namespace backend.Models;

public class Local
{
    public int Id { get; set; }
    public int IdPlaza { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string NumeroLocal { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public ICollection<Venta>? Ventas { get; set; }
    public ICollection<Inventario>? Inventarios { get; set; }
    public ICollection<Usuario>? Usuarios { get; set; }
}
