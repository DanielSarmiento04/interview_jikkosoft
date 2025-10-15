#!/bin/bash
# Script para ejecutar los tests del Sistema de Gestión de Biblioteca

# Exportar variable de entorno (misma que en env.example.sh)
export PG_CONNECTION_STRING="postgresql://user:password@localhost:5432/library"

echo "🧪 Ejecutando tests del Sistema de Gestión de Biblioteca..."
echo "Base de datos: $PG_CONNECTION_STRING"
echo ""

# Ejecutar pytest con los argumentos proporcionados
# Si no se proporcionan argumentos, ejecuta todos los tests con -v
if [ $# -eq 0 ]; then
    python -m pytest tests/ -v
else
    python -m pytest "$@"
fi
