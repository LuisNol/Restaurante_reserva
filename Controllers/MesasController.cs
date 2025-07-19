using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestauranteDB.Models;

namespace RestauranteDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MesasController : ControllerBase
    {
        private readonly RestauranteDbContext _context;

        public MesasController(RestauranteDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mesa>>> GetMesas()
        {
            var mesas = await _context.Mesas.ToListAsync();
            return Ok(new { mensaje = "Lista de mesas obtenida exitosamente.", datos = mesas });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Mesa>> GetMesa(long id)
        {
            var mesa = await _context.Mesas.FindAsync(id);
            if (mesa == null) return NotFound(new { mensaje = $"No se encontró la mesa con ID {id}." });
            return Ok(new { mensaje = "Mesa obtenida exitosamente.", datos = mesa });
        }

        [HttpPost]
        public async Task<ActionResult<Mesa>> CrearMesa([FromBody] Mesa dto)
        {
            var mesa = new Mesa { NumeroMesa = dto.NumeroMesa, Capacidad = dto.Capacidad };
            _context.Mesas.Add(mesa);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMesa), new { id = mesa.Id }, new { mensaje = "Mesa creada exitosamente.", datos = mesa });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarMesa(long id, [FromBody] Mesa dto)
        {
            var mesa = await _context.Mesas.FindAsync(id);
            if (mesa == null) return NotFound(new { mensaje = "Mesa no encontrada." });

            mesa.NumeroMesa = dto.NumeroMesa;
            mesa.Capacidad = dto.Capacidad;

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Mesa actualizada exitosamente.", datos = mesa });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarMesa(long id)
        {
            var mesa = await _context.Mesas.FindAsync(id);
            if (mesa == null) return NotFound(new { mensaje = "Mesa no encontrada." });

            _context.Mesas.Remove(mesa);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Mesa eliminada exitosamente." });
        }
    }
}
