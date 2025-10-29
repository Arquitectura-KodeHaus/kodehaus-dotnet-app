using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocalesController : ControllerBase
    {
        private readonly ILocalService _localService;

        public LocalesController(ILocalService localService)
        {
            _localService = localService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Local>>> GetLocales()
        {
            try
            {
                var locales = await _localService.GetAllAsync();
                return Ok(locales);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al obtener locales", message = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Local>> GetLocal(int id)
        {
            try
            {
                var local = await _localService.GetByIdAsync(id);
                if (local == null) return NotFound();
                return Ok(local);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al obtener local", message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Local>> CrearLocal(Local local)
        {
            try
            {
                if (local == null) return BadRequest();
                var nuevo = await _localService.CreateAsync(local);
                return CreatedAtAction(nameof(GetLocal), new { id = nuevo.Id }, nuevo);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { error = "Error al crear local en la base de datos", message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Local>> ActualizarLocal(int id, Local local)
        {
            try
            {
                var actualizado = await _localService.UpdateAsync(id, local);
                if (actualizado == null) return NotFound();
                return Ok(actualizado);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { error = "Error al actualizar local en la base de datos", message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarLocal(int id)
        {
            try
            {
                var eliminado = await _localService.DeleteAsync(id);
                if (!eliminado) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al eliminar local", message = ex.Message });
            }
        }
    }
}
