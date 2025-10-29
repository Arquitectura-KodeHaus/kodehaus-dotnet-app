using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly IVentaService _ventaService;

        public VentasController(IVentaService ventaService)
        {
            _ventaService = ventaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _ventaService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var venta = await _ventaService.GetByIdAsync(id);
            return venta == null ? NotFound() : Ok(venta);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Venta venta)
        {
            try
            {
                var nueva = await _ventaService.CreateAsync(venta);
                return CreatedAtAction(nameof(Get), new { id = nueva.Id }, nueva);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException is Npgsql.PostgresException pgEx && pgEx.SqlState == "23503")
                    return BadRequest(new { error = "El local especificado no existe. Verifica el campo 'idLocal'." });

                return StatusCode(500, new { error = "Error al guardar la venta en la base de datos." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }
}
