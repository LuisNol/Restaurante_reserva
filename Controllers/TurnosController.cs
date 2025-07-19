using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestauranteDB.Models;

namespace RestauranteDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TurnosController : ControllerBase
    {
        private readonly RestauranteDbContext _context;

        public TurnosController(RestauranteDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTurnos() => Ok(new
        {
            mensaje = "Lista de turnos obtenida exitosamente.",
            datos = await _context.Turnos.ToListAsync()
        });

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTurno(long id)
        {
            var turno = await _context.Turnos.FindAsync(id);
            if (turno == null)
                return NotFound(new { mensaje = "Turno no encontrado." });

            return Ok(new { mensaje = "Turno obtenido exitosamente.", datos = turno });
        }

        [HttpPost]
        public async Task<IActionResult> CrearTurno([FromBody] Turno dto)
        {
            _context.Turnos.Add(dto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTurno), new { id = dto.Id }, new { mensaje = "Turno creado exitosamente.", datos = dto });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarTurno(long id, [FromBody] Turno dto)
        {
            var turno = await _context.Turnos.FindAsync(id);
            if (turno == null)
                return NotFound(new { mensaje = "Turno no encontrado." });

            turno.EmpleadoId = dto.EmpleadoId;
            turno.MesaId = dto.MesaId;
            turno.FechaTurno = dto.FechaTurno;
            turno.HoraTurno = dto.HoraTurno;

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Turno actualizado exitosamente.", datos = turno });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarTurno(long id)
        {
            var turno = await _context.Turnos.FindAsync(id);
            if (turno == null)
                return NotFound(new { mensaje = "Turno no encontrado." });

            _context.Turnos.Remove(turno);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Turno eliminado exitosamente." });
        }
    }
}
