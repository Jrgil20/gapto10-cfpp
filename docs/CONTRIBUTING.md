# 🤝 Guía de Contribución a GapTo10

¡Gracias por tu interés en contribuir a GapTo10! Esta guía te ayudará a entender cómo puedes colaborar en el proyecto.

## 📋 Índice

1. [Código de Conducta](#código-de-conducta)
2. [Cómo Reportar Bugs](#cómo-reportar-bugs)
3. [Sugerir Mejoras](#sugerir-mejoras)
4. [Contribuir Código](#contribuir-código)
5. [Pull Requests](#pull-requests)
6. [Estándares de Código](#estándares-de-código)
7. [Proceso de Review](#proceso-de-review)

## 💬 Código de Conducta

Por favor, sé respetuoso y constructivo en todas las interacciones:

- Respeta a todos los contribuyentes
- Acepta las críticas constructivas
- Enfócate en lo mejor para la comunidad
- Reporta comportamiento inapropiado a través de issues privados

## 🐛 Cómo Reportar Bugs

Los bugs se reportan a través de [GitHub Issues](https://github.com/Jrgil20/gapto10-cfpp/issues).

### Antes de Reportar

1. Verifica si el bug ya fue reportado
2. Intenta reproducirlo en la versión más reciente
3. Recopila información del entorno (navegador, SO, etc.)

### Al Reportar un Bug

**Título claro y descriptivo**:
```
[BUG] La barra de progreso no se actualiza al cambiar notas
```

**Descripción que incluya**:
- Comportamiento esperado
- Comportamiento actual
- Pasos para reproducir
- Capturas de pantalla o videos si es posible
- Navegador y versión
- Sistema operativo

**Ejemplo**:
```markdown
## Descripción
La barra de progreso no se actualiza cuando cambio una nota de una evaluación.

## Comportamiento Esperado
La barra de progreso debe actualizarse inmediatamente al cambiar la nota.

## Comportamiento Actual
La barra permanece estática hasta recargar la página.

## Pasos para Reproducir
1. Crear una materia
2. Agregar una evaluación
3. Ingresar una nota
4. Cambiar la nota
5. Observar que la barra no se actualiza

## Información del Sistema
- Navegador: Chrome 120.0.6099.111
- SO: Windows 11 Pro
- Versión de GapTo10: v1.0.0
```

## 💡 Sugerir Mejoras

Las sugerencias se reportan también como [Issues](https://github.com/Jrgil20/gapto10-cfpp/issues) con la etiqueta `enhancement`.

### Proponer una Mejora

**Título descriptivo**:
```
[ENHANCEMENT] Agregar soporte para múltiples idiomas
```

**Información a incluir**:
- Descripción clara de la mejora
- Por qué crees que sería útil
- Ejemplos de cómo funcionaría
- Posibles alternativas

**Ejemplo**:
```markdown
## Descripción
Agregar la capacidad de personalizar los colores del Dashboard según el estado.

## Motivación
Los estudiantes pueden identificar más rápidamente el estado de sus materias
con colores personalizables según sus preferencias.

## Implementación Sugerida
- Agregar sección "Temas" en Configuración
- Permitir elegir entre tema claro, oscuro y personalizado
- Guardar preferencia en localStorage

## Alternativas Consideradas
- Solo temas predefinidos (limitado)
- Paleta de colores completamente personalizable (complejo)
```

## 💻 Contribuir Código

### Flujo de Trabajo Básico

1. **Fork el repositorio**
   ```bash
   # En GitHub, haz clic en el botón "Fork"
   ```

2. **Clone tu fork**
   ```bash
   git clone https://github.com/TU-USUARIO/gapto10-cfpp.git
   cd gapto10-cfpp
   ```

3. **Agrega el upstream**
   ```bash
   git remote add upstream https://github.com/Jrgil20/gapto10-cfpp.git
   ```

4. **Crea una rama**
   ```bash
   git checkout -b feature/tu-feature
   # Ejemplos:
   # feature/agregar-vista-mensual
   # fix/corregir-barra-progreso
   # docs/mejorar-readme
   ```

5. **Realiza cambios**
   ```bash
   # Edita archivos
   # Prueba tus cambios: pnpm dev
   # Ejecuta tests: pnpm test
   # Verifica linting: pnpm lint
   ```

6. **Commit y Push**
   ```bash
   git add .
   git commit -m "feat: descripción clara del cambio"
   git push origin feature/tu-feature
   ```

7. **Abre un Pull Request**
   - Ve a tu fork en GitHub
   - Haz clic en "New Pull Request"
   - Selecciona tu rama

### Nomenclatura de Ramas

```
feature/nombre-descriptivo    # Nuevas características
fix/nombre-descriptivo        # Correcciones de bugs
docs/nombre-descriptivo       # Cambios de documentación
refactor/nombre-descriptivo   # Refactorización de código
test/nombre-descriptivo       # Agregar o mejorar tests
```

## 📝 Pull Requests

### Estructura del PR

```markdown
## 📝 Descripción
Breve descripción de qué cambios realiza este PR.

## 🎯 Tipo de Cambio
- [ ] Nuevo feature
- [ ] Bug fix
- [ ] Documentación
- [ ] Refactorización
- [ ] Actualización de dependencias

## ✅ Checklist
- [ ] Mis cambios siguen el estilo de código del proyecto
- [ ] He ejecutado `pnpm lint` sin errores
- [ ] He ejecutado `pnpm test` sin fallos
- [ ] He actualizado la documentación si es necesario
- [ ] Mis commits tienen mensajes descriptivos

## 🔗 Issues Relacionados
Cierra #123

## 📸 Screenshots (si aplica)
[Agrega capturas si hay cambios visuales]

## 📋 Comentarios Adicionales
[Información adicional que consideres relevante]
```

### Ejemplo de PR Completo

```markdown
## 📝 Descripción
Implementa un selector de modo de cálculo en la vista de materia para cambiar dinámicamente entre los modos pesimista, normal y optimista sin recargar la página.

## 🎯 Tipo de Cambio
- [x] Nuevo feature
- [ ] Bug fix
- [ ] Documentación
- [ ] Refactorización
- [ ] Actualización de dependencias

## ✅ Checklist
- [x] Mis cambios siguen el estilo de código del proyecto
- [x] He ejecutado `pnpm lint` sin errores
- [x] He ejecutado `pnpm test` sin fallos
- [x] He actualizado la documentación
- [x] Mis commits tienen mensajes descriptivos

## 🔗 Issues Relacionados
Cierra #42

## 📸 Screenshots
[Captura del nuevo selector de modo]

## 📋 Cambios Realizados
- Agregado componente CalculationModeSelector
- Actualizado SubjectView para usar el selector
- Agregado test para el nuevo componente
- Actualizado WEB_VIEW.md con instrucciones
```

## 🎨 Estándares de Código

### TypeScript
- Siempre especifica tipos en props y variables
- Usa interfaces para objetos complejos
- Evita `any` a menos que sea absolutamente necesario

```typescript
// ❌ Malo
function handleClick(data) {
  console.log(data)
}

// ✅ Bueno
interface ClickData {
  id: string
  value: number
}

function handleClick(data: ClickData): void {
  console.log(data)
}
```

### Componentes React
- Usa componentes funcionales
- Custom hooks para lógica reutilizable
- Props bien tipadas

```typescript
// ✅ Bueno
interface CardProps {
  title: string
  content: React.ReactNode
  onClick?: () => void
}

export function Card({ title, content, onClick }: CardProps) {
  return (
    <div onClick={onClick}>
      <h3>{title}</h3>
      <div>{content}</div>
    </div>
  )
}
```

### Nombres de Funciones
- Componentes React: `PascalCase`
- Funciones y variables: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`

```typescript
// ✅ Correcto
export function MyComponent() { }
const calculateGrade = () => { }
const MAX_GRADE = 20
```

### Commits

Usa mensajes descriptivos siguiendo el formato Conventional Commits:

```
feat: agregar nuevo tipo de evaluación
fix: corregir cálculo de promedio
docs: actualizar guía de instalación
refactor: simplificar lógica de cálculos
test: agregar tests para validación
chore: actualizar dependencias
```

## 🔍 Proceso de Review

### El Mantainer Revisará

1. **Calidad de Código**
   - Sigue los estándares del proyecto
   - Sin código duplicado
   - Rendimiento adecuado

2. **Funcionalidad**
   - Los cambios funcionan correctamente
   - No rompen funcionalidades existentes
   - Todos los tests pasan

3. **Documentación**
   - Código bien comentado
   - Documentación actualizada
   - Cambios importantes en WEB_VIEW.md

4. **Testing**
   - Cambios críticos tienen tests
   - Cobertura adecuada
   - Todos los tests pasan

### Feedback del Mantainer

- Sé receptivo a las sugerencias
- Actualiza el PR según el feedback
- Requiere confirmación después de cambios significativos

## 🏆 Tipos de Contribuciones Bienvenidas

### 🐛 Reportar y Corregir Bugs
Cualquier bug encontrado es bienvenido, especialmente si vienes con una solución.

### ✨ Nuevas Características
- Mejoras UI/UX
- Nuevos modos de cálculo
- Exportación a nuevos formatos
- Internacionalización

### 📝 Documentación
- Mejoras al README
- Tutoriales
- Traducción de documentación
- Ejemplos de uso

### ⚡ Optimizaciones
- Mejoras de rendimiento
- Reducción de tamaño del bundle
- Optimización de componentes

### 🌐 Traducciones
- Agregar nuevos idiomas
- Mejorar traducciones existentes

## 🎓 Áreas para Principiantes

Si es tu primera contribución, puedes empezar por:
- Issues etiquetados como `good first issue`
- Issues etiquetados como `help wanted`
- Mejorar documentación
- Agregar tests

## 🚀 Proceso de Merge

Una vez que tu PR es aprobado:

1. El mantainer hará merge a la rama `develop`
2. Se agregará a la próxima release
3. Serás mencionado en los release notes

## 📚 Recursos Útiles

- [Configuración del Desarrollo](./SETUP.md)
- [Arquitectura del Proyecto](./ARCHITECTURE.md)
- [Guía de Vista Web](./WEB_VIEW.md)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Preguntas Frecuentes

**P: ¿Necesito permiso para contribuir?**
R: No, puedes simplemente hacer fork y enviar un PR.

**P: ¿Cuánto tiempo toma revisar un PR?**
R: Típicamente 2-7 días, dependiendo de la complejidad.

**P: ¿Puedo trabajar en un issue que ya está asignado?**
R: Mejor comenta en el issue primero para coordinarte.

**P: ¿Qué pasa si mi PR es rechazado?**
R: Es normal, obtendrás feedback detallado. Puedes mejorar y resubmitir.

## 📞 Contacto

- **GitHub Issues**: [Reportar aquí](https://github.com/Jrgil20/gapto10-cfpp/issues)
- **Maintainer**: [Jrgil20](https://github.com/Jrgil20)

---

**¡Gracias por considerar contribuir a GapTo10! Tu ayuda es invaluable para mejorar este proyecto.** 🎉
