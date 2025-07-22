using Microsoft.EntityFrameworkCore;
using RestauranteDB.Models;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://0.0.0.0:8080");

builder.Services.AddDbContext<RestauranteDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("connectionDb")));

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

// ⭐ CORS CORREGIDO
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder
            .WithOrigins(
                "http://localhost:5173", 
                "https://restaurante.avisonline.store"  // ⭐ SIN BARRA AL FINAL
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()); // ⭐ AGREGADO - Importante para auth
});

var app = builder.Build();

// ⭐ CORS DEBE IR PRIMERO - ANTES DE TODO
app.UseCors("AllowSpecificOrigin");

// ✅ Redirigir a Swagger
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/")
    {
        context.Response.Redirect("/swagger/index.html", permanent: false);
        return;
    }
    await next();
});

// ✅ Habilitar Swagger en cualquier entorno
app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI();

// app.UseHttpsRedirection();  // opcional en Docker

app.UseAuthorization();
app.MapControllers();

app.Run();