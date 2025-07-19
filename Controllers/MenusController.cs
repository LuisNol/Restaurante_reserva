using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestauranteDB.Models;

namespace RestauranteDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenusController : ControllerBase
    {

        private readonly RestauranteDbContext _context;

        public MenusController(RestauranteDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetMenuItems() => Ok(new
        {
            mensaje = "Lista del menú obtenida exitosamente.",
            datos = await _context.Menus.ToListAsync()
        });

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMenuItem(long id)
        {
            var item = await _context.Menus.FindAsync(id);
            if (item == null)
                return NotFound(new { mensaje = "Elemento del menú no encontrado." });

            return Ok(new { mensaje = "Elemento obtenido exitosamente.", datos = item });
        }

        [HttpPost]
        public async Task<IActionResult> CrearMenuItem([FromBody] Menu dto)
        {
            _context.Menus.Add(dto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMenuItem), new { id = dto.Id }, new { mensaje = "Elemento del menú creado exitosamente.", datos = dto });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarMenuItem(long id, [FromBody] Menu dto)
        {
            var item = await _context.Menus.FindAsync(id);
            if (item == null)
                return NotFound(new { mensaje = "Elemento del menú no encontrado." });

            item.Nombre = dto.Nombre;
            item.Descripcion = dto.Descripcion;
            item.Precio = dto.Precio;

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Elemento actualizado exitosamente.", datos = item });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarMenuItem(long id)
        {
            var item = await _context.Menus.FindAsync(id);
            if (item == null)
                return NotFound(new { mensaje = "Elemento del menú no encontrado." });

            _context.Menus.Remove(item);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Elemento del menú eliminado exitosamente." });
        }
    }
}

