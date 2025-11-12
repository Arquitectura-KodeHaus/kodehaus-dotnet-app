using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace backend.Controllers
{
    [Authorize(Roles = "Admin,User")]
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
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var inventarios = await _inventarioService.GetAllAsync();
                return Ok(inventarios);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al obtener inventarios", message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var inventario = await _inventarioService.GetByIdAsync(id);
                return inventario == null ? NotFound() : Ok(inventario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al obtener inventario", message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(Inventario inventario)
        {
            try
            {
                var nuevo = await _inventarioService.CreateAsync(inventario);
                if (nuevo == null)
                    return BadRequest("El Local especificado por 'IdLocal' no existe en la base de datos.");
                return CreatedAtAction(nameof(Get), new { id = nuevo.Id }, nuevo);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23503")
                    return BadRequest("El Local especificado por 'IdLocal' no existe en la base de datos.");
                return StatusCode(500, new { error = "Error al crear inventario", message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al crear inventario", message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Inventario inventario)
        {
            try
            {
                var actualizado = await _inventarioService.UpdateAsync(id, inventario);
                if (actualizado == null) return NotFound();
                return Ok(actualizado);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23503")
                    return BadRequest("El nuevo Local especificado por 'IdLocal' no existe en la base de datos.");
                return StatusCode(500, new { error = "Error al actualizar inventario", message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al actualizar inventario", message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var eliminado = await _inventarioService.DeleteAsync(id);
                return eliminado ? NoContent() : NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al eliminar inventario", message = ex.Message });
            }
        }
    }
}
