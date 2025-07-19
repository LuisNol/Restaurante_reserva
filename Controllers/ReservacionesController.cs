using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestauranteDB.Models;

namespace RestauranteDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservacionesController : ControllerBase
    {
        private readonly RestauranteDbContext _context;

        public ReservacionesController(RestauranteDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetReservaciones() => Ok(new
        {
            mensaje = "Lista de reservaciones obtenida exitosamente.",
            datos = await _context.Reservaciones.ToListAsync()
        });

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReservacion(long id)
        {
            var reservacion = await _context.Reservaciones.FindAsync(id);
            if (reservacion == null)
                return NotFound(new { mensaje = "Reservación no encontrada." });

            return Ok(new { mensaje = "Reservación obtenida exitosamente.", datos = reservacion });
        }

        [HttpPost]
        public async Task<IActionResult> CrearReservacion([FromBody] Reservacione dto)
        {
            _context.Reservaciones.Add(dto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetReservacion), new { id = dto.Id }, new { mensaje = "Reservación creada exitosamente.", datos = dto });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarReservacion(long id, [FromBody] Reservacione dto)
        {
            var reservacion = await _context.Reservaciones.FindAsync(id);
            if (reservacion == null)
                return NotFound(new { mensaje = "Reservación no encontrada." });

            reservacion.ClienteId = dto.ClienteId;
            reservacion.MesaId = dto.MesaId;
            reservacion.FechaReservacion = dto.FechaReservacion;
            reservacion.HoraReservacion = dto.HoraReservacion;
            reservacion.CantidadPersonas = dto.CantidadPersonas;

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Reservación actualizada exitosamente.", datos = reservacion });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarReservacion(long id)
        {
            var reservacion = await _context.Reservaciones.FindAsync(id);
            if (reservacion == null)
                return NotFound(new { mensaje = "Reservación no encontrada." });

            _context.Reservaciones.Remove(reservacion);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Reservación eliminada exitosamente." });
        }
    }
}
