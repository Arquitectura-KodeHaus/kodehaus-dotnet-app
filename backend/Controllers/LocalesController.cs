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
            var locales = await _localService.GetAllAsync();
            return Ok(locales);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Local>> GetLocal(int id)
        {
            var local = await _localService.GetByIdAsync(id);
            if (local == null) return NotFound();
            return Ok(local);
        }

        [HttpPost]
        public async Task<ActionResult<Local>> CrearLocal(Local local)
        {
            if(local == null) return BadRequest();
            var nuevo = await _localService.CreateAsync(local);
            return CreatedAtAction(nameof(GetLocal), new { id = nuevo.Id }, nuevo);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Local>> ActualizarLocal(int id, Local local)
        {
            var actualizado = await _localService.UpdateAsync(id, local);
            if (actualizado == null) return NotFound();
            return Ok(actualizado);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarLocal(int id)
        {
            var eliminado = await _localService.DeleteAsync(id);
            if (!eliminado) return NotFound();
            return NoContent();
        }
    }
}
