using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RestauranteDB.Models;

public partial class Turno
{
    public long Id { get; set; }

    public long EmpleadoId { get; set; }

    public long MesaId { get; set; }

    public DateOnly FechaTurno { get; set; }

    public string HoraTurno { get; set; } = null!;

    [JsonIgnore]
    public virtual Empleado? Empleado { get; set; }

    [JsonIgnore]
    public virtual Mesa? Mesa { get; set; }
}