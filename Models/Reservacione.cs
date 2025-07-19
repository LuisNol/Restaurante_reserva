using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RestauranteDB.Models;

public partial class Reservacione
{
    public long Id { get; set; }

    public long ClienteId { get; set; }

    public long MesaId { get; set; }

    public DateOnly FechaReservacion { get; set; }

    public TimeOnly HoraReservacion { get; set; }

    public int CantidadPersonas { get; set; }

    public virtual Cliente Cliente { get; set; } = null!;

    public virtual Mesa Mesa { get; set; } = null!;
    [JsonIgnore]
    public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
}
