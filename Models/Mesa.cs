using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RestauranteDB.Models;

public partial class Mesa
{
    public long Id { get; set; }

    public int NumeroMesa { get; set; }

    public int Capacidad { get; set; }

    public virtual ICollection<Reservacione> Reservaciones { get; set; } = new List<Reservacione>();

    [JsonIgnore]
    public virtual ICollection<Turno> Turnos { get; set; } = new List<Turno>();
}
