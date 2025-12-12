# 🎯 GapTo10 - Cuánto Falta Para Pasar

Una aplicación web para gestionar y calcular las notas necesarias en evaluaciones académicas. Ayuda a estudiantes a visualizar exactamente qué notas necesitan obtener en sus evaluaciones pendientes para aprobar sus materias.

## ✨ Características

- **Gestión de Materias**: Crea, edita y elimina materias con opción de división teoría/práctica
- **Registro de Evaluaciones**: Agrega evaluaciones con nombre, fecha, peso porcentual y sistema de puntos
- **Cálculo Automático de Notas**: Tres estrategias de cálculo:
  - 🛡️ **Pesimista**: Calcula el mínimo necesario para aprobar (modo predeterminado)
  - ⚖️ **Normal**: Proyecta basándose en tu rendimiento actual
  - 🚀 **Optimista**: Calcula para alcanzar una meta ambiciosa
- **Validación Teoría/Práctica**: Verifica aprobación individual cuando están separadas
- **Exportar/Importar**: Respalda y restaura tus datos en formato JSON
- **Persistencia Local**: Tus datos se guardan automáticamente en el navegador

## 🛠️ Tecnologías

- **React 19** - Interfaz de usuario
- **Vite 7** - Bundler y servidor de desarrollo
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos
- **Radix UI** - Componentes accesibles
- **Recharts** - Visualización de datos
- **LocalStorage** - Persistencia de datos

## 🚀 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 📖 Uso

1. **Crea una materia** haciendo clic en el botón "Nueva Materia"
2. **Agrega evaluaciones** con sus respectivos pesos porcentuales
3. **Registra las notas** obtenidas en cada evaluación realizada
4. **Visualiza automáticamente** las notas necesarias en las evaluaciones pendientes

## 🎨 Modos de Cálculo

| Modo | Descripción | Uso recomendado |
|------|-------------|-----------------|
| Pesimista | Nota mínima para aprobar | Cuando solo quieres pasar |
| Normal | Basado en tu rendimiento actual | Proyección realista |
| Optimista | Para alcanzar notas altas | Cuando quieres destacar |

## 📦 Exportar/Importar Datos

- **Exportar**: Ve a Configuración → Exportar para descargar un archivo JSON con todos tus datos
- **Importar**: Ve a Configuración → Importar para restaurar datos desde un archivo JSON

## 📄 Licencia

MIT License - Ver archivo [LICENSE](LICENSE) para más detalles.
