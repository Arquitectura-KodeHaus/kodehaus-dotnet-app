using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadosController : ControllerBase
    {
        private static List<Empleado> empleados = new()
        {
            new Empleado { Id = 1, Nombre = "Juan Pérez", Cargo = "Cajero", LocalId = 1 },
            new Empleado { Id = 2, Nombre = "María López", Cargo = "Vendedor", LocalId = 1 },
            new Empleado { Id = 3, Nombre = "Carlos Ruiz", Cargo = "Administrador", LocalId = 2 }
        };

        // Obtener todos los empleados
        [HttpGet]
        public IActionResult GetAll() => Ok(empleados);

        // Obtener un empleado por ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var empleado = empleados.FirstOrDefault(e => e.Id == id);
            return empleado == null ? NotFound(new { message = "Empleado no encontrado" }) : Ok(empleado);
        }

        // Crear un nuevo empleado
        [HttpPost]
        public IActionResult Create([FromBody] Empleado nuevoEmpleado)
        {
            if (nuevoEmpleado == null || string.IsNullOrWhiteSpace(nuevoEmpleado.Nombre))
                return BadRequest(new { message = "Datos de empleado inválidos" });

            nuevoEmpleado.Id = empleados.Any() ? empleados.Max(e => e.Id) + 1 : 1;
            empleados.Add(nuevoEmpleado);

            return CreatedAtAction(nameof(GetById), new { id = nuevoEmpleado.Id }, nuevoEmpleado);
        }

        // Actualizar un empleado existente
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Empleado empleadoActualizado)
        {
            var empleado = empleados.FirstOrDefault(e => e.Id == id);
            if (empleado == null)
                return NotFound(new { message = "Empleado no encontrado" });

            empleado.Nombre = empleadoActualizado.Nombre ?? empleado.Nombre;
            empleado.Cargo = empleadoActualizado.Cargo ?? empleado.Cargo;
            empleado.LocalId = empleadoActualizado.LocalId;

            return Ok(empleado);
        }

        // Eliminar un empleado
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var empleado = empleados.FirstOrDefault(e => e.Id == id);
            if (empleado == null)
                return NotFound(new { message = "Empleado no encontrado" });

            empleados.Remove(empleado);
            return NoContent();
        }
    }
}
