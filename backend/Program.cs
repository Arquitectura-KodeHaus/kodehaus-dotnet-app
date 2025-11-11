using backend.Context;
using backend.Services;
using backend.Services.Implementations;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// CRITICAL: Configure Kestrel to listen on Cloud Run PORT
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(int.Parse(port));
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Register services
builder.Services.AddScoped<ILocalService, LocalService>();
builder.Services.AddScoped<IInventarioService, InventarioService>();
builder.Services.AddScoped<IVentaService, VentaService>();
builder.Services.AddScoped<IDataService, DataService>();
// ✅ NUEVO: HttpClient para llamadas a otros servicios
builder.Services.AddHttpClient();

// Database
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql(connectionString));

// Controllers and API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS Configuration
if (builder.Environment.IsProduction())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });
}
else
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });
}

var app = builder.Build();

// ✅ Aplicar migraciones automáticamente al iniciar
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        
        Console.WriteLine("🔄 Applying database migrations...");
        context.Database.Migrate();
        Console.WriteLine("✅ Database migrations applied successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error applying migrations: {ex.Message}");
        if (ex.InnerException != null)
        {
            Console.WriteLine($"   Inner Exception: {ex.InnerException.Message}");
        }
    }
}

// Swagger in all environments for testing
app.UseSwagger();
app.UseSwaggerUI();

// DO NOT use HTTPS redirection in Cloud Run (handled by load balancer)
// app.UseHttpsRedirection();

// CRITICAL: CORS must be before UseAuthorization
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

Console.WriteLine($"🚀 Starting application on port {port}");
Console.WriteLine($"🌍 Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"🔗 Connection String: {connectionString?.Substring(0, Math.Min(50, connectionString?.Length ?? 0))}...");

app.Run();
