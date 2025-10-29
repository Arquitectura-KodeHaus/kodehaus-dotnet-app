using backend.Services;
using backend.Services.Interfaces;
using backend.Services.Implementations;
using backend.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configurar la cadena de conexión
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Registrar servicios
builder.Services.AddScoped<ILocalService, LocalService>();
builder.Services.AddScoped<IInventarioService, InventarioService>();
builder.Services.AddScoped<IVentaService, VentaService>();
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ CONFIGURAR CORS - Agregar ANTES de builder.Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",  // Desarrollo local
                "https://kodehaus-frontend-dotnet-616328447495.us-central1.run.app"  // Producción
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ USAR CORS - Debe ir ANTES de UseAuthorization()
app.UseCors("AllowAngular");

app.UseAuthorization();
app.MapControllers();

app.Run();
