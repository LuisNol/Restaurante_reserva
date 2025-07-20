using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RestauranteDB.Models;

public partial class Pedido
{
    public long Id { get; set; }

    public long ReservacionId { get; set; }

    public long MenuId { get; set; }

    public int Cantidad { get; set; }

    public DateTimeOffset? HoraPedido { get; set; }

    [JsonIgnore]
    public virtual Menu? Menu { get; set; }

    [JsonIgnore]
    public virtual Reservacione? Reservacion { get; set; }
}