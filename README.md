# 🚀 Kodehaus Dotnet app

<div align="center">

![Angular](https://img.shields.io/badge/Angular-16-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![C#](https://img.shields.io/badge/C%23-Latest-239120?style=for-the-badge&logo=c-sharp&logoColor=white)

Una aplicación web moderna construida con Angular en el frontend y .NET en el backend.

[Características](#características) •
[Requisitos](#requisitos) •
[Instalación](#instalación) •
[Uso](#uso) •
[Estructura](#estructura-del-proyecto)

</div>

---

## ✨ Características

- 🎨 **Interfaz Moderna**: UI con diseño glassmorphism y animaciones suaves
- 🔄 **Comunicación HTTP**: Integración completa entre frontend y backend
- 🎯 **API RESTful**: Backend .NET con controladores API
- 📱 **Responsive Design**: Adaptable a todos los dispositivos
- 🚀 **Hot Reload**: Desarrollo rápido con recarga en caliente
- 🔒 **CORS Configurado**: Comunicación segura entre servicios

---

## 📋 Requisitos

Asegúrate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (v9 o superior)
- **.NET SDK** (v8.0 o superior) - [Descargar](https://dotnet.microsoft.com/download)
- **Angular CLI** (v16 o superior)

```bash
# Verificar versiones
node --version
npm --version
dotnet --version
ng version
```

---

## 🛠️ Instalación

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/kodehaus-dotnet-app.git
cd kodehaus-dotnet-app
```

### 2️⃣ Configurar el Backend

```bash
cd backend
dotnet restore
dotnet build
```

### 3️⃣ Configurar el Frontend

```bash
cd ../frontend
npm install
```

---

## 🚀 Uso

### Ejecutar el Backend

Abre una terminal en la carpeta `backend`:

```bash
cd backend
dotnet run
```

El backend estará disponible en:
- 🌐 **HTTP**: `http://localhost:5000`
- 📚 **Swagger**: `http://localhost:5000/swagger` (en modo desarrollo)

### Ejecutar el Frontend

Abre una **segunda terminal** en la carpeta `frontend`:

```bash
cd frontend
npm start
```

El frontend estará disponible en:
- 🌐 **URL**: `http://localhost:4200`

---

## 📁 Estructura del Proyecto

```
kodehaus-dotnet-app/
│
├── 📂 backend/                    # Aplicación .NET
│   ├── 📂 Controllers/            # Controladores API
│   │   └── ApiController.cs       # Endpoint principal
│   ├── 📂 Models/                 # Modelos de datos
│   │   └── SampleModel.cs         # Modelo de ejemplo
│   ├── 📂 Services/               # Lógica de negocio
│   │   └── DataService.cs         # Servicio de datos
│   ├── Program.cs                 # Punto de entrada
│   ├── appsettings.json          # Configuración
│   └── backend.csproj            # Proyecto .NET
│
├── 📂 frontend/                   # Aplicación Angular
│   ├── 📂 src/
│   │   ├── 📂 app/
│   │   │   ├── 📂 services/      # Servicios HTTP
│   │   │   │   └── api.service.ts
│   │   │   ├── app.component.ts   # Componente principal
│   │   │   ├── app.component.html # Template
│   │   │   ├── app.component.css  # Estilos
│   │   │   └── app.module.ts      # Módulo principal
│   │   ├── index.html             # HTML base
│   │   └── styles.css             # Estilos globales
│   ├── angular.json               # Configuración Angular
│   ├── package.json               # Dependencias npm
│   └── tsconfig.json              # Configuración TypeScript
│
├── .gitignore                     # Archivos ignorados por Git
└── README.md                      # Este archivo
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/api` | Obtiene lista de datos de ejemplo |

#### Ejemplo de Respuesta

```json
[
  {
    "id": 1,
    "name": "Sample 1",
    "description": "Description 1"
  },
  {
    "id": 2,
    "name": "Sample 2",
    "description": "Description 2"
  },
  {
    "id": 3,
    "name": "Sample 3",
    "description": "Description 3"
  }
]
```

---

## 🎨 Características del Frontend

- **Framework**: Angular 16
- **Lenguaje**: TypeScript
- **Estilos**: CSS3 con gradientes y animaciones
- **HTTP Client**: Angular HttpClient
- **Componentes**: Modular y reutilizable

### Servicios

#### ApiService
Maneja todas las llamadas HTTP al backend.

```typescript
getSampleData(): Observable<SampleModel[]>
```

---

## ⚙️ Características del Backend

- **Framework**: ASP.NET Core 8.0
- **Arquitectura**: MVC con Servicios
- **CORS**: Configurado para desarrollo
- **Swagger**: Documentación API automática
- **Inyección de Dependencias**: Patrón built-in

### Servicios

#### IDataService
Interfaz para el servicio de datos.

```csharp
List<SampleModel> GetSampleData()
```

---

## 🔧 Configuración

### CORS (Backend)

El backend está configurado para aceptar peticiones desde:
- `http://localhost:4200` (Angular dev server)

Para modificar, edita `Program.cs`:

```csharp
policy.WithOrigins("http://localhost:4200")
      .AllowAnyHeader()
      .AllowAnyMethod();
```

### Environment (Frontend)

Para cambiar la URL del backend, edita `src/app/services/api.service.ts`:

```typescript
private baseUrl = 'http://localhost:5000/api';
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
dotnet test
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 📦 Build para Producción

### Backend

```bash
cd backend
dotnet publish -c Release -o ./publish
```

### Frontend

```bash
cd frontend
npm run build
```

Los archivos compilados estarán en `frontend/dist/`.

---

## 🐛 Troubleshooting

### El frontend no se conecta al backend

1. Verifica que el backend esté ejecutándose en `http://localhost:5000`
2. Revisa la consola del navegador para errores CORS
3. Asegúrate de que ambos servicios estén corriendo

### Error de compilación en Angular

```bash
cd frontend
rm -rf node_modules
npm install
```

### Error de compilación en .NET

```bash
cd backend
dotnet clean
dotnet restore
dotnet build
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

</div>
