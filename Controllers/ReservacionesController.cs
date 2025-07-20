using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestauranteDB.Models;


[Route("api/[controller]")]
[ApiController]
public class ReservacionesController : ControllerBase
{
    private readonly RestauranteDbContext _context;

    public ReservacionesController(RestauranteDbContext context)
    {
        _context = context;
    }

    // GET: api/Reservaciones
    [HttpGet]
    public async Task<ActionResult> GetReservaciones()
    {
        var reservaciones = await _context.Reservaciones
            .Include(r => r.Cliente)
            .Include(r => r.Mesa)
            .ToListAsync();

        return Ok(new
        {
            mensaje = "Reservaciones obtenidas exitosamente.",
            datos = reservaciones
        });
    }

    // GET: api/Reservaciones/5
    [HttpGet("{id}")]
    public async Task<ActionResult> GetReservacion(long id)
    {
        var reservacion = await _context.Reservaciones
            .Include(r => r.Cliente)
            .Include(r => r.Mesa)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (reservacion == null)
        {
            return NotFound(new { mensaje = "Reservación no encontrada." });
        }

        return Ok(new { mensaje = "Reservación encontrada.", datos = reservacion });
    }

    // POST: api/Reservaciones
    [HttpPost]
    public async Task<IActionResult> CrearReservacion([FromBody] Reservacione dto)
    {
        try
        {
            _context.Reservaciones.Add(dto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReservacion), new { id = dto.Id }, new
            {
                mensaje = "Reservación creada exitosamente.",
                datos = dto
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = "Error al crear la reservación.", error = ex.Message });
        }
    }

    // PUT: api/Reservaciones/5
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

        try
        {
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Reservación actualizada.", datos = reservacion });
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = "Error al actualizar la reservación.", error = ex.Message });
        }
    }

    // DELETE: api/Reservaciones/5
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
