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

### Requisitos Previos
- Node.js >= 20.0.0
- pnpm >= 10.0.0

### Comandos

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Construir para producción
pnpm build

# Previsualizar build de producción
pnpm preview

# Ejecutar linter
pnpm lint

# Ejecutar tests
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch
```

> **Nota**: Este proyecto usa **pnpm** como gestor de paquetes. Si aún no lo tienes instalado, ejecuta: `npm install -g pnpm@10`

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

## 📚 Documentación

Para información detallada, consulta la carpeta [`docs/`](./docs/):

- **[Documentación General](./docs/README.md)** - Índice completo de documentación
- **[Guía de Vista Web](./docs/WEB_VIEW.md)** - Cómo usar la aplicación
- **[Configuración del Desarrollo](./docs/SETUP.md)** - Instrucciones para desarrolladores
- **[Arquitectura del Proyecto](./docs/ARCHITECTURE.md)** - Descripción técnica
- **[Guía de Contribución](./docs/CONTRIBUTING.md)** - Cómo contribuir

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor consulta nuestra [Guía de Contribución](./docs/CONTRIBUTING.md) para:

1. **Reportar bugs**: Abre un [issue](https://github.com/Jrgil20/gapto10-cfpp/issues)
2. **Sugerir mejoras**: Usa la etiqueta `enhancement` en issues
3. **Contribuir código**: Sigue el flujo de fork → rama → pull request

### Áreas donde puedes contribuir

- 🐛 **Reportar bugs**: Si encuentras algún error, repórtalo
- 💡 **Nuevas funcionalidades**: Propón ideas para mejorar la aplicación
- 🎨 **Mejoras de UI/UX**: Sugerencias de diseño y experiencia de usuario
- 📝 **Documentación**: Mejorar o ampliar la documentación
- 🌐 **Traducciones**: Ayudar a internacionalizar la aplicación
- ⚡ **Optimizaciones**: Mejoras de rendimiento o código

## 🙏 Créditos

- **Desarrollado por**: [Jrgil20](https://github.com/Jrgil20)
- **Asistencia de IA**: Claude AI
- **Concepción inicial**: GitHub Spark

## 📄 Licencia

MIT License - Ver archivo [LICENSE](LICENSE) para más detalles.
