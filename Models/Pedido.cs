using System;
using System.Collections.Generic;

namespace RestauranteDB.Models;

public partial class Pedido
{
    public long Id { get; set; }

    public long ReservacionId { get; set; }

    public long MenuId { get; set; }

    public int Cantidad { get; set; }

    public DateTimeOffset? HoraPedido { get; set; }

    public virtual Menu Menu { get; set; } = null!;

    public virtual Reservacione Reservacion { get; set; } = null!;
}
