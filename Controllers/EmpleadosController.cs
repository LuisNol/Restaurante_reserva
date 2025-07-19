using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestauranteDB.Models;

namespace RestauranteDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadosController : ControllerBase
    {
        private readonly RestauranteDbContext _context;

        public EmpleadosController(RestauranteDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetEmpleados() => Ok(new
        {
            mensaje = "Lista de empleados obtenida exitosamente.",
            datos = await _context.Empleados.ToListAsync()
        });

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmpleado(long id)
        {
            var empleado = await _context.Empleados.FindAsync(id);
            if (empleado == null)
                return NotFound(new { mensaje = "Empleado no encontrado." });

            return Ok(new { mensaje = "Empleado obtenido exitosamente.", datos = empleado });
        }

        [HttpPost]
        public async Task<IActionResult> CrearEmpleado([FromBody] Empleado dto)
        {
            _context.Empleados.Add(dto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEmpleado), new { id = dto.Id }, new { mensaje = "Empleado creado exitosamente.", datos = dto });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarEmpleado(long id, [FromBody] Empleado dto)
        {
            var empleado = await _context.Empleados.FindAsync(id);
            if (empleado == null)
                return NotFound(new { mensaje = "Empleado no encontrado." });

            empleado.Nombre = dto.Nombre;
            empleado.Apellido = dto.Apellido;
            empleado.Rol = dto.Rol;
            empleado.FechaContratacion = dto.FechaContratacion;

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Empleado actualizado exitosamente.", datos = empleado });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarEmpleado(long id)
        {
            var empleado = await _context.Empleados.FindAsync(id);
            if (empleado == null)
                return NotFound(new { mensaje = "Empleado no encontrado." });

            _context.Empleados.Remove(empleado);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Empleado eliminado exitosamente." });
        }
    }
}
