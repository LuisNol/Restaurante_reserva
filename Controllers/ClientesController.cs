using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestauranteDB.Models;

namespace RestauranteDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
      
            private readonly RestauranteDbContext _context;

            public ClientesController(RestauranteDbContext context)
            {
                _context = context;
            }

            // GET: api/cursos
            [HttpGet]
            public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
            {
                var clientes = await _context.Clientes.ToListAsync();
                return Ok(new
                {
                    mensaje = "Lista de cliente obtenida exitosamente.",
                    datos = clientes
                });
            }

        // GET: api/clientes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(long id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound(new
                {
                    mensaje = $"No se encontró el cliente con ID {id}."
                });
            }

            return Ok(new
            {
                mensaje = "Cliente obtenido exitosamente.",
                datos = cliente
            });
        }

        // POST: api/clientes
        [HttpPost]
        public async Task<ActionResult<Cliente>> CrearCliente([FromBody] Cliente dto)
        {
            var cliente = new Cliente
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Telefono = dto.Telefono,
                CorreoElectronico = dto.CorreoElectronico
            };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, new
            {
                mensaje = "Cliente creado exitosamente.",
                datos = cliente
            });
        }

        // PUT: api/clientes/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarCliente(long id, [FromBody] Cliente dto)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound(new { mensaje = "Cliente no encontrado." });
            }

            cliente.Nombre = dto.Nombre;
            cliente.Apellido = dto.Apellido;
            cliente.Telefono = dto.Telefono;
            cliente.CorreoElectronico = dto.CorreoElectronico;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                return BadRequest(new { mensaje = "Error al actualizar el cliente.", error = e.Message });
            }

            return Ok(new { mensaje = "Cliente actualizado exitosamente.", datos = cliente });
        }

        // DELETE: api/clientes/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCliente(long id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound(new { mensaje = "Cliente no encontrado." });
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Cliente eliminado exitosamente." });
        }



    }
}

