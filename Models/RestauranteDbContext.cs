using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace RestauranteDB.Models;

public partial class RestauranteDbContext : DbContext
{
    public RestauranteDbContext()
    {
    }

    public RestauranteDbContext(DbContextOptions<RestauranteDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Empleado> Empleados { get; set; }

    public virtual DbSet<Menu> Menus { get; set; }

    public virtual DbSet<Mesa> Mesas { get; set; }

    public virtual DbSet<Pedido> Pedidos { get; set; }

    public virtual DbSet<Reservacione> Reservaciones { get; set; }

    public virtual DbSet<Turno> Turnos { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__clientes__3213E83F0FAFC6F5");

            entity.ToTable("clientes");

            entity.HasIndex(e => e.CorreoElectronico, "UQ__clientes__5B8A0682E98909CB").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Apellido)
                .HasMaxLength(100)
                .HasColumnName("apellido");
            entity.Property(e => e.CorreoElectronico)
                .HasMaxLength(255)
                .HasColumnName("correo_electronico");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .HasColumnName("nombre");
            entity.Property(e => e.Telefono)
                .HasMaxLength(20)
                .HasColumnName("telefono");
        });

        modelBuilder.Entity<Empleado>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__empleado__3213E83FEDDB4475");

            entity.ToTable("empleados");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Apellido)
                .HasMaxLength(100)
                .HasColumnName("apellido");
            entity.Property(e => e.FechaContratacion).HasColumnName("fecha_contratacion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .HasColumnName("nombre");
            entity.Property(e => e.Rol)
                .HasMaxLength(100)
                .HasColumnName("rol");
        });

        modelBuilder.Entity<Menu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__menu__3213E83F0DF059DD");

            entity.ToTable("menu");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Descripcion).HasColumnName("descripcion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(200)
                .HasColumnName("nombre");
            entity.Property(e => e.Precio)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("precio");
        });

        modelBuilder.Entity<Mesa>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__mesas__3213E83F97577FAC");

            entity.ToTable("mesas");

            entity.HasIndex(e => e.NumeroMesa, "UQ__mesas__B95EBF660C4DAA9E").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Capacidad).HasColumnName("capacidad");
            entity.Property(e => e.NumeroMesa).HasColumnName("numero_mesa");
        });

        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__pedidos__3213E83FDE4D6632");

            entity.ToTable("pedidos");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Cantidad).HasColumnName("cantidad");
            entity.Property(e => e.HoraPedido)
                .HasDefaultValueSql("(sysdatetimeoffset())")
                .HasColumnName("hora_pedido");
            entity.Property(e => e.MenuId).HasColumnName("menu_id");
            entity.Property(e => e.ReservacionId).HasColumnName("reservacion_id");

            entity.HasOne(d => d.Menu).WithMany(p => p.Pedidos)
                .HasForeignKey(d => d.MenuId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__pedidos__menu_id__44FF419A");

            entity.HasOne(d => d.Reservacion).WithMany(p => p.Pedidos)
                .HasForeignKey(d => d.ReservacionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__pedidos__reserva__440B1D61");
        });

        modelBuilder.Entity<Reservacione>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__reservac__3213E83FC73F8D53");

            entity.ToTable("reservaciones");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CantidadPersonas).HasColumnName("cantidad_personas");
            entity.Property(e => e.ClienteId).HasColumnName("cliente_id");
            entity.Property(e => e.FechaReservacion).HasColumnName("fecha_reservacion");
            entity.Property(e => e.HoraReservacion).HasColumnName("hora_reservacion");
            entity.Property(e => e.MesaId).HasColumnName("mesa_id");

            entity.HasOne(d => d.Cliente).WithMany(p => p.Reservaciones)
                .HasForeignKey(d => d.ClienteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__reservaci__clien__3D5E1FD2");

            entity.HasOne(d => d.Mesa).WithMany(p => p.Reservaciones)
                .HasForeignKey(d => d.MesaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__reservaci__mesa___3E52440B");
        });

        modelBuilder.Entity<Turno>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__turnos__3213E83FE48C99A0");

            entity.ToTable("turnos");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.EmpleadoId).HasColumnName("empleado_id");
            entity.Property(e => e.FechaTurno).HasColumnName("fecha_turno");
            entity.Property(e => e.HoraTurno)
                .HasMaxLength(50)
                .HasColumnName("hora_turno");
            entity.Property(e => e.MesaId).HasColumnName("mesa_id");

            entity.HasOne(d => d.Empleado).WithMany(p => p.Turnos)
                .HasForeignKey(d => d.EmpleadoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__turnos__empleado__49C3F6B7");

            entity.HasOne(d => d.Mesa).WithMany(p => p.Turnos)
                .HasForeignKey(d => d.MesaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__turnos__mesa_id__4AB81AF0");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
