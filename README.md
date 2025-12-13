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

# Ejecutar linter
npm run lint
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

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes ideas, sugerencias o quieres colaborar en el proyecto:

1. **Reportar problemas o sugerir ideas**: Abre un [issue](https://github.com/Jrgil20/gapto10-cfpp/issues) describiendo el problema o la idea
2. **Proponer mejoras**: Crea un issue con la etiqueta `enhancement` explicando tu propuesta
3. **Contribuir código**:
   - Haz un fork del repositorio
   - Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
   - Realiza tus cambios y commits
   - Abre un Pull Request describiendo los cambios

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
