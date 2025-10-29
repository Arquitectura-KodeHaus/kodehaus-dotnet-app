using backend.Context;
using backend.Services;
using backend.Services.Implementations;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var conecctionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddScoped<ILocalService, LocalService>();
builder.Services.AddScoped<IInventarioService, InventarioService>();
builder.Services.AddScoped<IVentaService, VentaService>();
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(conecctionString));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200",
                "https://kodehaus-frontend-dotnet-616328447495.us-central1.run.app")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddScoped<IDataService, DataService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Comentado para desarrollo

app.UseCors("AllowAngular");
app.UseAuthorization();
app.MapControllers();

app.Run();
