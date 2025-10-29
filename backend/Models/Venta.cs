using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models;

public class Venta
{
    public int Id { get; set; }
    public int IdLocal { get; set; }
    public DateTime Fecha { get; set; }
    public decimal Total { get; set; }
    [ForeignKey(nameof(IdLocal))]
    [JsonIgnore]
    public Local? Local { get; set; }
    public ICollection<VentaInventario>? VentaInventarios { get; set; }
}
