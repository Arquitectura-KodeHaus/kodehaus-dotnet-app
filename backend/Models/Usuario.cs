using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string NombreUsuario { get; set; } = string.Empty;
        public string Contrasena { get; set; } = string.Empty;
        public string Cedula { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
        public int IdLocal { get; set; }

        [ForeignKey(nameof(IdLocal))]
        [JsonIgnore]
        public Local? Local { get; set; }

    }
}
