# Plazapp - AI Coding Agent Instructions

## Project Overview

**Plazapp** is a full-stack web application for managing commercial establishments (locales comerciales) with Angular frontend and .NET backend deployed on Google Cloud Platform (GCP). The system provides comprehensive CRUD operations for locales, inventarios (inventory), ventas (sales), and empleados (employees).

### Core Architecture
- **Frontend**: Angular 16 with TypeScript, deployed on Cloud Run
- **Backend**: ASP.NET Core 8.0 Web API, deployed on Cloud Run
- **Database**: Cloud SQL PostgreSQL (instance: `pg-prod`)
- **Cloud Platform**: Google Cloud Platform (project: `kodehaus-prod-474304`)
- **CI/CD**: GitHub Actions with Workload Identity Federation (no static keys)
- **Region**: `us-central1`

### Production URLs
- **Backend API**: `https://kodehaus-backend-service-616328447495.us-central1.run.app`
- **Frontend**: `https://kodehaus-frontend-dotnet-616328447495.us-central1.run.app`
- **Database Connection**: `/cloudsql/kodehaus-prod-474304:us-central1:pg-prod`

## Critical Cloud Run Configuration

### Port Configuration (CRITICAL)
Cloud Run requires containers to listen on the port specified by the `PORT` environment variable (default 8080).

**Backend (Program.cs)** MUST include:
```csharp
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(int.Parse(port));
});
```

**Frontend (Nginx)** listens on port 8080 via nginx.conf:
```nginx
listen 8080;
```

### HTTPS Redirection
**DO NOT** use `app.UseHttpsRedirection()` in backend/Program.cs. Cloud Run handles HTTPS termination at the load balancer level.

## Database Configuration

### Cloud SQL Connection Details
- **Instance**: `pg-prod`
- **Connection Name**: `kodehaus-prod-474304:us-central1:pg-prod`
- **Database**: `localservice`
- **User**: `postgres`
- **Password**: `Pr0d-ChangeMe!`
- **Connection Method**: Unix socket (Cloud SQL Auth Proxy)

### Connection String (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=/cloudsql/kodehaus-prod-474304:us-central1:pg-prod;Database=localservice;Username=postgres;Password=Pr0d-ChangeMe!;"
  }
}
```

**Important**: Connection string uses Unix socket path (`/cloudsql/...`) NOT TCP hostname. Cloud Run automatically provides Cloud SQL Auth Proxy when configured via GitHub Actions.

## CORS Configuration

### Production CORS (backend/Program.cs)
```csharp
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
```

### CORS Middleware Order
```csharp
app.UseCors("AllowFrontend");  // BEFORE UseAuthorization
app.UseAuthorization();
```

**Critical**: CORS must be configured BEFORE `UseAuthorization()` in the middleware pipeline.

## Frontend Environment Configuration

### Dynamic Environment Generation
Frontend Dockerfile dynamically generates `environment.prod.ts` during build:

```dockerfile
ARG BACKEND_URL
RUN echo "export const environment = { production: true, apiUrl: '${BACKEND_URL}/api' };" > src/environments/environment.prod.ts
```

### Environment Import Pattern
**Components MUST import**:
```typescript
import { environment } from '../../environments/environment';  // NOT environment.prod
```

Angular's `fileReplacements` in `angular.json` automatically swaps files during production build.

### API URL Pattern
- **environment.apiUrl**: Includes `/api` suffix (e.g., `https://.../api`)
- **Service calls**: Do NOT add `/api` prefix (e.g., `${this.apiUrl}/locales`)
- **Result**: Final URLs are correct: `https://.../api/locales`

## API Service Architecture

### Centralized HTTP Client (frontend/src/app/services/api.service.ts)
All HTTP calls go through a single `ApiService` with methods for each entity:

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  // Locales
  getLocales(): Observable<Local[]> { return this.http.get<Local[]>(`${this.apiUrl}/locales`); }
  createLocal(local: Local): Observable<Local> { return this.http.post<Local>(`${this.apiUrl}/locales`, local); }
  
  // Inventarios
  getInventarios(): Observable<Inventario[]> { return this.http.get<Inventario[]>(`${this.apiUrl}/inventarios`); }
  
  // Ventas
  getVentas(): Observable<Venta[]> { return this.http.get<Venta[]>(`${this.apiUrl}/ventas`); }
  
  // Empleados
  getEmpleados(): Observable<Empleado[]> { return this.http.get<Empleado[]>(`${this.apiUrl}/empleados`); }
}
```

### Bilingual Method Aliases
Some methods have Spanish/English aliases for flexibility:
```typescript
obtenerLocales = this.getLocales;
crearLocal = this.createLocal;
```

## Backend Architecture

### Controller Pattern
```csharp
[Route("api/[controller]")]
[ApiController]
public class LocalesController : ControllerBase
{
    private readonly ILocalService _localService;
    
    public LocalesController(ILocalService localService) { _localService = localService; }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Local>>> GetLocales() { /* ... */ }
}
```

**Route Pattern**: `/api/{controller}` (e.g., `/api/locales`, `/api/inventarios`)

### Service Layer Pattern
- **Interfaces**: `backend/Services/Interfaces/ILocalService.cs`
- **Implementations**: `backend/Services/Implementations/LocalService.cs`
- **Dependency Injection**: Registered as `Scoped` in Program.cs

```csharp
builder.Services.AddScoped<ILocalService, LocalService>();
builder.Services.AddScoped<IInventarioService, InventarioService>();
builder.Services.AddScoped<IVentaService, VentaService>();
```

### Entity Framework Core
- **DbContext**: `backend/Context/AppDbContext.cs`
- **Models**: `backend/Models/` (Local, Inventario, Venta, Empleado, VentaInventario)
- **Migrations**: `backend/Migrations/`

**DbContext Registration**:
```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
```

## GitHub Actions Workflows

### Backend Deployment (.github/workflows/backend.yml)

**Triggers**:
```yaml
on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/workflows/backend.yml'
```

**Key Steps**:
1. Build .NET application (`dotnet publish`)
2. Build Docker image with Dockerfile
3. Push to Artifact Registry (`us-central1-docker.pkg.dev/kodehaus-prod-474304/kodehaus-repo/kodehaus-backend-service`)
4. Deploy to Cloud Run with Cloud SQL connection

**Critical Environment Variables**:
- `ASPNETCORE_ENVIRONMENT=Production`
- `PORT=8080` (set by Cloud Run)

**Cloud SQL Connection**:
```yaml
--add-cloudsql-instances=kodehaus-prod-474304:us-central1:pg-prod
```

### Frontend Deployment (.github/workflows/frontend.yml)

**Build Argument**:
```yaml
docker build --build-arg BACKEND_URL=${{ secrets.BACKEND_URL_DOTNET }}
```

**Secret Required**: `BACKEND_URL_DOTNET` = `https://kodehaus-backend-service-616328447495.us-central1.run.app`

**Health Checks**: Cloud Run configured to check port 8080

## Docker Configuration

### Backend Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY bin/Release/net8.0/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "backend.dll"]
```

**Critical**: `ASPNETCORE_URLS` sets default port, but Kestrel configuration in Program.cs overrides with PORT from environment.

### Frontend Dockerfile (Multi-stage)
```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG BACKEND_URL
RUN echo "export const environment = { production: true, apiUrl: '${BACKEND_URL}/api' };" > src/environments/environment.prod.ts
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist/frontend-new /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
```

### Nginx Configuration (frontend/nginx.conf)
```nginx
server {
    listen 8080;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Note**: Nginx serves Angular app on port 8080 for Cloud Run compatibility.

## Data Models

### Local (Commercial Establishment)
```typescript
interface Local {
  id?: number;
  nombre: string;          // Name
  categoria: string;       // Category (e.g., "Restaurante", "Tienda")
  numeracion: string;      // Number/Code
  estado: string;          // Status (Activo, Inactivo, Mantenimiento)
}
```

### Inventario (Inventory)
```typescript
interface Inventario {
  id?: number;
  localId: number;         // Foreign key to Local
  producto: string;
  cantidad: number;
  precioUnitario: number;
  stockMinimo: number;
}
```

### Venta (Sale)
```typescript
interface Venta {
  id?: number;
  localId: number;         // Foreign key to Local
  fecha: Date;
  total: number;
  metodoPago: string;      // Payment method
  items: VentaInventario[]; // Sale items
}
```

### Empleado (Employee)
```typescript
interface Empleado {
  id?: number;
  localId: number;         // Foreign key to Local
  nombre: string;
  apellido: string;
  cargo: string;           // Position (Gerente, Cajero, Vendedor, etc.)
  salario: number;
  fechaContratacion: Date;
}
```

## Naming Conventions

### Backend (C#)
- **Controllers**: PascalCase ending with `Controller` (e.g., `LocalesController`)
- **Services**: PascalCase with `Service` suffix (e.g., `LocalService`)
- **Interfaces**: PascalCase with `I` prefix (e.g., `ILocalService`)
- **Models**: PascalCase (e.g., `Local`, `Inventario`)
- **Properties**: PascalCase (e.g., `NombreLocal`, `FechaVenta`)

### Frontend (TypeScript/Angular)
- **Components**: kebab-case files, PascalCase class (e.g., `locales.component.ts` → `LocalesComponent`)
- **Services**: kebab-case files, PascalCase class (e.g., `api.service.ts` → `ApiService`)
- **Interfaces**: PascalCase (e.g., `Local`, `Inventario`)
- **Properties**: camelCase (e.g., `nombreLocal`, `fechaVenta`)

## Design System

### CSS Variables (src/styles.css)
```css
:root {
  --sidebar-bg: #1E1E1E;
  --header-bg: #F3F3F3;
  --primary: #8AA57D;        /* Verde natural */
  --primary-dark: #6C8A5F;
  --accent: #A7C49A;
  --bg: #FFFFFF;
  --card-bg: #F9FBF9;
  --muted: #6B6B6B;
  --shadow: 0 6px 18px rgba(15,23,16,0.08);
  --radius: 10px;
}
```

### Typography
- **Font Family**: `'Inter', sans-serif` (loaded from Google Fonts)
- **Font Sizes**: Defined in CSS variables for consistency

## Project Structure

```
kodehaus-dotnet-app/
├── .github/
│   ├── workflows/
│   │   ├── backend.yml                  # Backend CI/CD
│   │   └── frontend.yml                 # Frontend CI/CD
│   └── copilot-instructions.md          # This file
├── backend/
│   ├── Controllers/
│   │   ├── ApiController.cs
│   │   ├── EmpleadosController.cs
│   │   ├── InventariosController.cs
│   │   ├── LocalesController.cs
│   │   └── VentasController.cs
│   ├── Services/
│   │   ├── Interfaces/
│   │   │   ├── IInventarioService.cs
│   │   │   ├── ILocalService.cs
│   │   │   └── IVentaService.cs
│   │   └── Implementations/
│   │       ├── InventarioService.cs
│   │       ├── LocalService.cs
│   │       └── VentaService.cs
│   ├── Models/
│   │   ├── Empleado.cs
│   │   ├── Inventario.cs
│   │   ├── Local.cs
│   │   ├── Venta.cs
│   │   └── VentaInventario.cs
│   ├── Context/
│   │   └── AppDbContext.cs
│   ├── Migrations/
│   │   ├── 20251028152610_InitialFixed.cs
│   │   ├── 20251028152610_InitialFixed.Designer.cs
│   │   └── AppDbContextModelSnapshot.cs
│   ├── Program.cs                       # CRITICAL: Entry point, CORS, DI, port config
│   ├── appsettings.json                 # CRITICAL: DB connection string
│   ├── backend.csproj
│   ├── backend.sln
│   ├── Dockerfile
│   └── request.http                     # REST Client test file
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── empleados/
│   │   │   │   ├── inventarios/
│   │   │   │   ├── locales/
│   │   │   │   ├── operaciones/         # Per-local operations
│   │   │   │   └── ventas/
│   │   │   ├── services/
│   │   │   │   └── api.service.ts       # CRITICAL: Centralized HTTP client
│   │   │   ├── models/
│   │   │   │   └── local.model.ts
│   │   │   ├── app.component.ts
│   │   │   ├── app.module.ts
│   │   │   └── app-routing.module.ts
│   │   ├── environments/
│   │   │   ├── environment.ts           # Development config
│   │   │   └── environment.prod.ts      # GENERATED DYNAMICALLY in Dockerfile
│   │   ├── styles.css                   # Global styles with CSS variables
│   │   └── index.html
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile                       # CRITICAL: Multi-stage build with BACKEND_URL arg
│   └── nginx.conf                       # CRITICAL: Port 8080 config
├── README.md                            # Main project documentation
├── start-kodehaus.sh                    # Production startup script
└── start-local.sh                       # Local development startup script
```

## Common Tasks

### Adding a New Entity

**1. Backend Model** (`backend/Models/NewEntity.cs`):
```csharp
public class NewEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    // Add properties
}
```

**2. Update DbContext** (`backend/Context/AppDbContext.cs`):
```csharp
public DbSet<NewEntity> NewEntities { get; set; }
```

**3. Create Migration**:
```bash
cd backend
dotnet ef migrations add AddNewEntity
dotnet ef database update
```

**4. Service Interface** (`backend/Services/Interfaces/INewEntityService.cs`):
```csharp
public interface INewEntityService
{
    Task<IEnumerable<NewEntity>> GetAllAsync();
    Task<NewEntity> GetByIdAsync(int id);
    Task<NewEntity> CreateAsync(NewEntity entity);
    Task<NewEntity> UpdateAsync(NewEntity entity);
    Task DeleteAsync(int id);
}
```

**5. Service Implementation** (`backend/Services/Implementations/NewEntityService.cs`)

**6. Controller** (`backend/Controllers/NewEntitiesController.cs`):
```csharp
[Route("api/[controller]")]
[ApiController]
public class NewEntitiesController : ControllerBase
{
    private readonly INewEntityService _service;
    
    public NewEntitiesController(INewEntityService service) { _service = service; }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NewEntity>>> GetAll() { /* ... */ }
}
```

**7. Register Service in Program.cs**:
```csharp
builder.Services.AddScoped<INewEntityService, NewEntityService>();
```

**8. Frontend Model** (`frontend/src/app/models/new-entity.model.ts`):
```typescript
export interface NewEntity {
  id?: number;
  name: string;
}
```

**9. Update ApiService** (`frontend/src/app/services/api.service.ts`):
```typescript
getNewEntities(): Observable<NewEntity[]> {
  return this.http.get<NewEntity[]>(`${this.apiUrl}/newentities`);
}

createNewEntity(entity: NewEntity): Observable<NewEntity> {
  return this.http.post<NewEntity>(`${this.apiUrl}/newentities`, entity);
}
```

**10. Create Component**:
```bash
cd frontend
ng generate component components/new-entities
```

### Testing Backend Endpoints (request.http)

Use VS Code REST Client extension:

```http
### Get all locales
GET https://kodehaus-backend-service-616328447495.us-central1.run.app/api/locales

### Create local
POST https://kodehaus-backend-service-616328447495.us-central1.run.app/api/locales
Content-Type: application/json

{
  "nombre": "Local de Prueba",
  "categoria": "Tienda",
  "numeracion": "L-001",
  "estado": "Activo"
}
```

### Local Development

**Backend**:
```powershell
cd backend
dotnet restore
dotnet ef database update
dotnet run
```
Runs on `http://localhost:5000` or `https://localhost:5001`

**Frontend**:
```powershell
cd frontend
npm install
ng serve
```
Runs on `http://localhost:4200`

**Note**: Update `frontend/src/environments/environment.ts` to point to local backend:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

## Debugging

### Frontend Console Errors
Check browser DevTools → Console for:
- CORS errors (verify backend CORS config)
- 404 errors (verify URL construction in ApiService)
- Environment variable issues (verify environment.prod.ts generation)

### Backend Logs (Cloud Run)
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=kodehaus-backend-service" --limit 50 --format json
```

### Common Issues

**1. Backend not starting on Cloud Run**
- ✅ Check: Program.cs reads PORT environment variable
- ✅ Check: Kestrel configured to listen on PORT
- ✅ Check: UseHttpsRedirection() removed
- ✅ Check: Dockerfile exposes port 8080

**2. CORS errors**
- ✅ Check: CORS policy configured in Program.cs
- ✅ Check: UseCors() called BEFORE UseAuthorization()
- ✅ Check: AllowAnyOrigin() in production

**3. Database connection failures**
- ✅ Check: Cloud SQL instance added in GitHub Actions workflow
- ✅ Check: Connection string uses Unix socket path
- ✅ Check: Database credentials correct in appsettings.json

**4. Frontend calling wrong URL**
- ✅ Check: BACKEND_URL secret in GitHub
- ✅ Check: Dockerfile ARG BACKEND_URL passed correctly
- ✅ Check: environment.prod.ts generated with correct URL
- ✅ Check: Components import from `environment` not `environment.prod`

## Security Considerations

### Secrets Management
- ❌ **NEVER** commit database passwords to Git
- ✅ Use GitHub Secrets for sensitive values (BACKEND_URL_DOTNET, GCP_WIF_PROVIDER, GCP_SA_EMAIL)
- ✅ Use Workload Identity Federation for GCP authentication (no static service account keys)

### CORS in Production
Current configuration allows ANY origin for simplicity. For production hardening:
```csharp
policy.WithOrigins("https://kodehaus-frontend-dotnet-616328447495.us-central1.run.app")
      .AllowAnyHeader()
      .AllowAnyMethod();
```

### Database Security
- ✅ Cloud SQL uses Unix socket (no public IP exposure)
- ✅ Cloud Run service account has Cloud SQL Client role
- ⚠️ Change default password `Pr0d-ChangeMe!` in production

## Testing Strategy

### Backend Testing
- **Unit Tests**: Test services in isolation with mock repositories
- **Integration Tests**: Test controllers with in-memory database
- **API Testing**: Use request.http file with REST Client extension

### Frontend Testing
- **Unit Tests**: `ng test` with Jasmine/Karma
- **E2E Tests**: Configure Protractor or Cypress (not currently set up)
- **Manual Testing**: Browser DevTools + Network tab

## Performance Optimization

### Backend
- Use `AsNoTracking()` for read-only queries
- Implement caching for frequently accessed data
- Use pagination for large datasets

### Frontend
- Lazy loading for feature modules
- OnPush change detection strategy for components
- RxJS operators for efficient data streams

## Deployment Checklist

**Before deploying to production:**
- [ ] All database migrations applied
- [ ] Environment variables set in GitHub Secrets
- [ ] CORS configured appropriately
- [ ] Backend PORT configuration tested
- [ ] Frontend BACKEND_URL pointing to production backend
- [ ] Health check endpoints responding
- [ ] Cloud SQL connection working
- [ ] Logs reviewed for errors

## Support and Resources

### Documentation
- [Angular Documentation](https://angular.io/docs)
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)

### Tools
- **VS Code Extensions**: 
  - C# Dev Kit
  - Angular Language Service
  - REST Client
  - Docker
- **CLI Tools**: 
  - .NET SDK 8.0
  - Angular CLI
  - gcloud CLI

## Known Issues / Current State

### ✅ Working
- Frontend deployed and accessible
- Frontend correctly calling production backend URL
- CORS configured properly
- GitHub Actions workflows executing
- Docker builds completing successfully
- Frontend environment variables injected correctly

### 🔧 In Progress / Known Issues
- Backend container startup on Cloud Run (port configuration issue being resolved)
- End-to-end database connectivity testing pending backend deployment fix
- Health check endpoints may need implementation

### 📋 Future Enhancements
- Authentication/Authorization (JWT tokens)
- Role-based access control
- Audit logging
- Data export/import functionality
- Advanced reporting and analytics
- Mobile responsive improvements
- Progressive Web App (PWA) capabilities

---

**Last Updated**: Based on conversation context up to backend port configuration debugging
**Maintainer**: Development team
**Contact**: Via GitHub issues or project repository

## Quick Reference Commands

```powershell
# Backend
cd backend
dotnet restore
dotnet build
dotnet ef database update
dotnet run

# Frontend
cd frontend
npm install
ng serve
ng build --configuration production

# Docker (local testing)
docker build -t backend-test ./backend
docker run -p 8080:8080 backend-test

docker build --build-arg BACKEND_URL=http://localhost:5000 -t frontend-test ./frontend
docker run -p 8080:8080 frontend-test

# Deploy manually (if needed)
gcloud run deploy kodehaus-backend-service --source ./backend --region us-central1
gcloud run deploy kodehaus-frontend-dotnet --source ./frontend --region us-central1
```

---

**This instruction file is for AI coding assistants (GitHub Copilot, Cursor, Claude, etc.) to understand the complete project context and architecture.**
