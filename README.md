# Plazapp - Sistema de Gestión de Locales Comerciales

## Descripción

Plazapp es un sistema completo de gestión económica para comerciantes que permite administrar locales comerciales y sus operaciones diarias. El sistema está construido con una arquitectura moderna que separa el backend (.NET) del frontend (Angular).

## Características Principales

### 🏢 Gestión General de Locales
- CRUD completo para locales comerciales
- Categorización por tipo de negocio
- Control de estados (Activo, Inactivo, Mantenimiento)
- Numeración y organización por plaza

### ⚙️ Operaciones por Local
Cada local tiene su propio módulo de operaciones que incluye:

#### 📦 Gestión de Inventarios
- Control de productos específicos del local
- Seguimiento de stock y precios
- Alertas de stock bajo y agotado
- Valorización de inventarios

#### 💰 Gestión de Ventas
- Registro de ventas específicas del local
- Estadísticas de ventas diarias y totales
- Historial de transacciones ordenado
- Cálculo de promedios y métricas

#### 👥 Gestión de Empleados
- Registro de personal específico del local
- Categorización por cargos con colores distintivos
- Estadísticas por tipo de cargo
- Administración completa del personal

### 📊 Dashboard Inteligente
- Estadísticas generales del sistema
- Métricas de rendimiento por local
- Actividad reciente
- Acceso rápido a todas las funcionalidades

## Tecnologías Utilizadas

### Backend (.NET)
- **Framework**: .NET 8.0
- **ORM**: Entity Framework Core
- **Base de Datos**: PostgreSQL
- **Arquitectura**: Clean Architecture con servicios
- **API**: RESTful con controladores

### Frontend (Angular)
- **Framework**: Angular 17+
- **Lenguaje**: TypeScript
- **Estilos**: CSS3 con variables CSS y diseño moderno
- **Routing**: Angular Router con navegación anidada
- **HTTP**: HttpClient para comunicación con API
- **Fuentes**: Inter (Google Fonts)

## Diseño y UX

### 🎨 Sistema de Diseño Moderno
- **Paleta de colores**: Verde natural (#8AA57D) con acentos
- **Tipografía**: Inter para una apariencia profesional
- **Layout**: Sidebar fijo con contenido principal
- **Componentes**: Cards, modales, tablas y formularios consistentes

### 📱 Características Responsive
- Sidebar adaptativo para móviles
- Grids que se ajustan automáticamente
- Formularios optimizados para pantallas pequeñas
- Navegación táctil apropiada

## Estructura del Proyecto

```
plazapp-dotnet-app/
├── backend/                 # API .NET
│   ├── Controllers/         # Controladores de API
│   ├── Models/             # Modelos de datos
│   ├── Services/           # Lógica de negocio
│   ├── Context/            # Contexto de Entity Framework
│   └── Migrations/         # Migraciones de base de datos
├── frontend/               # Aplicación Angular
│   ├── src/app/
│   │   ├── components/     # Componentes de UI
│   │   │   ├── dashboard/  # Dashboard principal
│   │   │   ├── locales/    # Gestión general de locales
│   │   │   └── operaciones/ # Operaciones por local
│   │   │       ├── inventarios-local/
│   │   │       ├── ventas-local/
│   │   │       └── empleados-local/
│   │   ├── services/       # Servicios de API
│   │   ├── models/         # Interfaces TypeScript
│   │   └── app.module.ts   # Módulo principal
│   └── src/styles.css      # Estilos globales con variables CSS
└── README.md
```

## Instalación y Configuración

### Prerrequisitos
- .NET 8.0 SDK
- Node.js 18+
- PostgreSQL
- Angular CLI

### Backend
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

### Scripts de Inicio
```bash
# Desarrollo local completo
./start-local.sh

# Producción completa
./start-kodehaus.sh
```

## Uso del Sistema

### 1. Dashboard Principal
- Vista general con estadísticas del sistema
- Navegación rápida a todas las secciones
- Actividad reciente de ventas

### 2. Gestión de Locales
- Crear y administrar locales comerciales
- Configurar categorías y estados
- Vista general de todos los locales

### 3. Operaciones por Local
- Seleccionar un local específico
- Acceder a sus operaciones individuales:
  - **Inventarios**: Gestionar productos y stock
  - **Ventas**: Registrar y consultar ventas
  - **Empleados**: Administrar personal

### 4. Navegación
- **Sidebar**: Navegación principal siempre visible
- **Breadcrumbs**: Navegación contextual en operaciones
- **Botones de acción**: Acceso rápido a funciones principales

## API Endpoints

### Locales
- `GET /api/locales` - Obtener todos los locales
- `GET /api/locales/{id}` - Obtener local específico
- `POST /api/locales` - Crear nuevo local
- `PUT /api/locales/{id}` - Actualizar local
- `DELETE /api/locales/{id}` - Eliminar local

### Inventarios
- `GET /api/inventarios` - Obtener todos los inventarios
- `POST /api/inventarios` - Crear nuevo inventario
- `PUT /api/inventarios/{id}` - Actualizar inventario
- `DELETE /api/inventarios/{id}` - Eliminar inventario

### Ventas
- `GET /api/ventas` - Obtener todas las ventas
- `POST /api/ventas` - Crear nueva venta
- `PUT /api/ventas/{id}` - Actualizar venta
- `DELETE /api/ventas/{id}` - Eliminar venta

### Empleados
- `GET /api/empleados` - Obtener todos los empleados
- `POST /api/empleados` - Crear nuevo empleado
- `PUT /api/empleados/{id}` - Actualizar empleado
- `DELETE /api/empleados/{id}` - Eliminar empleado

## Variables CSS del Sistema de Diseño

```css
:root {
  --sidebar-bg: #1E1E1E;
  --header-bg: #F3F3F3;
  --primary: #8AA57D;
  --primary-dark: #6C8A5F;
  --accent: #A7C49A;
  --bg: #FFFFFF;
  --card-bg: #F9FBF9;
  --muted: #6B6B6B;
  --shadow: 0 6px 18px rgba(15,23,16,0.08);
  --radius: 10px;
}
```

## Características de Accesibilidad

- Navegación por teclado completa
- Contraste adecuado de colores
- Textos descriptivos para lectores de pantalla
- Formularios con validación clara
- Estados visuales consistentes

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para soporte técnico o preguntas sobre el sistema, contacta al equipo de desarrollo.

---

**Plazapp** - Simplificando la gestión comercial moderna 🏪✨