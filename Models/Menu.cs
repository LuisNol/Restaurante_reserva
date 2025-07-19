using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RestauranteDB.Models;

public partial class Menu
{
    public long Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public decimal Precio { get; set; }

    [JsonIgnore]
    public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
}
