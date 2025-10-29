using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models;

public class Inventario
{
    public int Id { get; set; }
    public int IdLocal { get; set; }
    public int IdProductoCatalogo { get; set; }
    public decimal PrecioUnitario { get; set; }
    public int Stock { get; set; }
    [ForeignKey(nameof(IdLocal))]
    [JsonIgnore]
    public Local? Local { get; set; }
    [JsonIgnore]
    public ICollection<VentaInventario>? VentaInventarios { get; set; }
}
