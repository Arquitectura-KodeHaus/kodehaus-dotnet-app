using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models;

public class VentaInventario
{
    public int IdInventario { get; set; }
    public int IdVenta { get; set; }
    public int Cantidad { get; set; }
    public decimal Subtotal { get; set; }
    [ForeignKey(nameof(IdVenta))]
    [JsonIgnore]
    public Venta? Venta { get; set; }
    [ForeignKey(nameof(IdInventario))]
    [JsonIgnore]
    public Inventario? Inventario { get; set; }
}
