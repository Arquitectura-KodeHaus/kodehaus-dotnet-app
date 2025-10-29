using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventariosController : ControllerBase
    {
        private readonly IInventarioService _inventarioService;

        public InventariosController(IInventarioService inventarioService)
        {
            _inventarioService = inventarioService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _inventarioService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var inventario = await _inventarioService.GetByIdAsync(id);
            return inventario == null ? NotFound() : Ok(inventario);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Inventario inventario)
        {
            var nuevo = await _inventarioService.CreateAsync(inventario);

            // Retorna 400 Bad Request si el servicio devuelve null por FK inexistente
            if (nuevo == null)
            {
                return BadRequest("El Local especificado por 'IdLocal' no existe en la base de datos.");
            }
            
            return CreatedAtAction(nameof(Get), new { id = nuevo.Id }, nuevo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Inventario inventario)
        {
            var actualizado = await _inventarioService.UpdateAsync(id, inventario);
    
            if (actualizado == null)
            {
                // Diferenciar si no se encontró el inventario (NotFound)
                // o si falló la verificación de la FK (Bad Request)
                /*if (!await _inventarioService.LocalExists(inventario.IdLocal))
                {
                    return BadRequest("El nuevo Local especificado por 'IdLocal' no existe en la base de datos.");
                }*/
                
                return NotFound(); // Si el inventario original con el 'id' no se encontró.
            }

            return Ok(actualizado);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eliminado = await _inventarioService.DeleteAsync(id);
            return eliminado ? NoContent() : NotFound();
        }
    }
}
