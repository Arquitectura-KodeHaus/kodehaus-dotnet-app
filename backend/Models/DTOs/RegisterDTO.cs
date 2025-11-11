namespace backend.Models.DTOs
{
    public class RegisterDTO
    {
        public string NombreUsuario { get; set; } = string.Empty;
        public string Contraseña { get; set; } = string.Empty;
        public string Cedula { get; set; } = string.Empty;
    }
}
