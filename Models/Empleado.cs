using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RestauranteDB.Models;

public partial class Empleado
{
    public long Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string Apellido { get; set; } = null!;

    public string Rol { get; set; } = null!;

    public DateOnly FechaContratacion { get; set; }

    [JsonIgnore]
    public virtual ICollection<Turno> Turnos { get; set; } = new List<Turno>();
}
