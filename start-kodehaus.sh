#!/bin/bash

# Script para ejecutar KodeHaus - Sistema de Gestión de Locales
# Este script inicia tanto el backend (.NET) como el frontend (Angular)

echo "🏪 Iniciando KodeHaus - Sistema de Gestión de Locales"
echo "=================================================="

# Verificar que estamos en el directorio correcto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Este script debe ejecutarse desde el directorio raíz del proyecto"
    echo "   Asegúrate de estar en: kodehaus-dotnet-app/"
    exit 1
fi

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar prerrequisitos
echo "🔍 Verificando prerrequisitos..."

if ! command_exists dotnet; then
    echo "❌ .NET SDK no encontrado. Instala .NET 8.0 SDK"
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js no encontrado. Instala Node.js 18+"
    exit 1
fi

if ! command_exists ng; then
    echo "❌ Angular CLI no encontrado. Instálalo con: npm install -g @angular/cli"
    exit 1
fi

echo "✅ Prerrequisitos verificados"

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Configurar trap para limpiar procesos
trap cleanup SIGINT SIGTERM

# Iniciar backend
echo ""
echo "🚀 Iniciando backend (.NET)..."
cd backend

# Restaurar dependencias si es necesario
if [ ! -d "bin" ]; then
    echo "📦 Restaurando dependencias del backend..."
    dotnet restore
fi

# Ejecutar migraciones si es necesario
echo "🗄️  Verificando base de datos..."
dotnet ef database update --no-build 2>/dev/null || {
    echo "⚠️  Error con migraciones. Asegúrate de que la base de datos esté configurada correctamente"
}

# Iniciar backend en background
dotnet run &
BACKEND_PID=$!

# Esperar un momento para que el backend inicie
sleep 3

# Verificar si el backend está funcionando
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Error: No se pudo iniciar el backend"
    exit 1
fi

echo "✅ Backend iniciado (PID: $BACKEND_PID)"

# Volver al directorio raíz e iniciar frontend
cd ../frontend

echo ""
echo "🚀 Iniciando frontend (Angular)..."

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
fi

# Iniciar frontend en background
ng serve --open=false &
FRONTEND_PID=$!

# Esperar un momento para que el frontend inicie
sleep 5

# Verificar si el frontend está funcionando
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Error: No se pudo iniciar el frontend"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"

# Mostrar información de acceso
echo ""
echo "🎉 ¡KodeHaus está funcionando!"
echo "=================================="
echo "📊 Frontend: http://localhost:4200"
echo "🔧 Backend API: http://localhost:5000/api"
echo "📚 Swagger UI: http://localhost:5000/swagger"
echo ""
echo "📋 Funcionalidades disponibles:"
echo "   • Dashboard con estadísticas"
echo "   • Gestión de Locales"
echo "   • Control de Inventarios"
echo "   • Registro de Ventas"
echo "   • Administración de Empleados"
echo ""
echo "💡 Presiona Ctrl+C para detener todos los servicios"
echo ""

# Mantener el script ejecutándose
wait
