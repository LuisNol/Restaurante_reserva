using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RestauranteDB.Models;

public partial class Cliente
{
    public long Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string Apellido { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public string CorreoElectronico { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Reservacione> Reservaciones { get; set; } = new List<Reservacione>();
}
