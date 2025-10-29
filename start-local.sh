#!/bin/bash

# Script simple para desarrollo local de KodeHaus
echo "🏪 Iniciando KodeHaus - Desarrollo Local"
echo "========================================"

# Verificar que estamos en el directorio correcto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
fi

echo "🚀 Iniciando backend local (.NET)..."
cd backend
dotnet run &
BACKEND_PID=$!

echo "✅ Backend iniciado en http://localhost:5000"
echo "📚 Swagger UI disponible en: http://localhost:5000/swagger"

# Esperar un momento para que el backend inicie
sleep 3

echo ""
echo "🚀 Iniciando frontend local (Angular)..."
cd ../frontend
ng serve --open &
FRONTEND_PID=$!

echo "✅ Frontend iniciado en http://localhost:4200"

echo ""
echo "🎉 ¡KodeHaus está funcionando localmente!"
echo "=========================================="
echo "📊 Frontend: http://localhost:4200"
echo "🔧 Backend API: http://localhost:5000/api"
echo "📚 Swagger UI: http://localhost:5000/swagger"
echo ""
echo "💡 Presiona Ctrl+C para detener todos los servicios"

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Configurar trap para limpiar procesos
trap cleanup SIGINT SIGTERM

# Mantener el script ejecutándose
wait
