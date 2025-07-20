using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RestauranteDB.Models;

using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public partial class Reservacione
{
    public long Id { get; set; }

    [Column("cliente_id")]
    public long ClienteId { get; set; }

    [Column("mesa_id")]
    public long MesaId { get; set; }

    [Column("fecha_reservacion")]
    public DateOnly FechaReservacion { get; set; }

    [Column("hora_reservacion")]
    public TimeSpan HoraReservacion { get; set; } // Compatible con SQL TIME

    [Column("cantidad_personas")]
    public int CantidadPersonas { get; set; }

    // Relaciones (opcional para evitar ciclos)
    [JsonIgnore]
    public virtual Cliente? Cliente { get; set; }

    [JsonIgnore]
    public virtual Mesa? Mesa { get; set; }

    [JsonIgnore]
    public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
}