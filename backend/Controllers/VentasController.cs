using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

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
        public async Task<IActionResult> GetAll()
        {
            try
            {
                return Ok(await _ventaService.GetAllAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al obtener ventas", message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var venta = await _ventaService.GetByIdAsync(id);
                return venta == null ? NotFound() : Ok(venta);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al obtener venta", message = ex.Message });
            }
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
                if (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23503")
                    return BadRequest(new { error = "El local especificado no existe. Verifica el campo 'idLocal'." });

                return StatusCode(500, new { error = "Error al guardar la venta en la base de datos.", message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }
}
