using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestauranteDB.Models;

namespace RestauranteDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        private readonly RestauranteDbContext _context;

        public PedidosController(RestauranteDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPedidos() => Ok(new
        {
            mensaje = "Lista de pedidos obtenida exitosamente.",
            datos = await _context.Pedidos.ToListAsync()
        });

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPedido(long id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
                return NotFound(new { mensaje = "Pedido no encontrado." });

            return Ok(new { mensaje = "Pedido obtenido exitosamente.", datos = pedido });
        }

        [HttpPost]
        public async Task<IActionResult> CrearPedido([FromBody] Pedido dto)
        {
            _context.Pedidos.Add(dto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPedido), new { id = dto.Id }, new { mensaje = "Pedido creado exitosamente.", datos = dto });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarPedido(long id, [FromBody] Pedido dto)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
                return NotFound(new { mensaje = "Pedido no encontrado." });

            pedido.ReservacionId = dto.ReservacionId;
            pedido.MenuId = dto.MenuId;
            pedido.Cantidad = dto.Cantidad;
            pedido.HoraPedido = dto.HoraPedido;

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Pedido actualizado exitosamente.", datos = pedido });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarPedido(long id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
                return NotFound(new { mensaje = "Pedido no encontrado." });

            _context.Pedidos.Remove(pedido);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Pedido eliminado exitosamente." });
        }
    }
}
