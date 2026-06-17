# 🤖 Reglas para Agentes IA - GapTo10

Este archivo contiene directrices para agentes de IA (como Claude) que trabajan en este proyecto.

## 📋 Principios Generales

1. **Lee primero, escribe después**: Siempre lee los archivos relacionados antes de hacer cambios
2. **Pequeños y enfocados**: Los commits deben ser pequeños, específicos y enfocados en un objetivo
3. **Prueba localmente**: Verifica que los cambios compilan/ejecutan correctamente cuando sea posible
4. **Mantén consistencia**: Sigue los patrones y convenciones ya establecidas en el proyecto
5. **Comunica cambios**: Describe claramente qué se cambió y por qué en el commit message

## 🛠️ Stack y Tecnologías

**No cambiar sin autorización explícita del usuario:**
- React 19 (framework principal)
- TypeScript (lenguaje de tipos)
- Vite 7 (bundler)
- Tailwind CSS 4 (estilos)
- pnpm >= 10.0.0 (gestor de paquetes)

**Libre de cambiar/actualizar:**
- Dependencias de desarrollo (devDependencies) - siempre mantenido a la última versión compatible
- Dependencias de testing (Vitest)
- Eslint/Prettier config

## 📁 Estructura del Proyecto

### Carpetas y su propósito:

```
gapto10-cfpp/
├── config/              # Archivos de configuración (eslint, tailwind, etc)
├── docs/                # Documentación (guías, arquitectura, etc)
├── public/              # Archivos estáticos públicos
├── src/
│   ├── components/      # Componentes React
│   │   ├── ui/         # Componentes UI base (Radix UI)
│   │   └── *.tsx       # Componentes de features
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Lógica de negocio y utilidades
│   ├── types.ts        # Tipos globales
│   ├── App.tsx         # Componente raíz
│   └── main.tsx        # Punto de entrada
├── .claude/            # Configuración específica de Claude Code
├── package.json        # Dependencias
├── tsconfig.json       # Configuración TypeScript
├── vite.config.ts      # Configuración Vite
├── README.md           # Documentación principal
└── CLAUDE.md           # Este archivo
```

### Reglas por carpeta:

**`src/components/`**
- Componentes funcionales con TypeScript
- Props bien tipadas (no usar `any`)
- Nombres en PascalCase
- Un componente por archivo (o máximo 2 si son muy relacionados)
- Archivos de test junto al componente: `Component.tsx` + `Component.test.tsx`

**`src/hooks/`**
- Custom hooks reutilizables
- Nombres comenzando con `use` (ej: `useLocalStorage.ts`)
- Lógica de estado/efectos encapsulada
- Con tests si la lógica es compleja

**`src/lib/`**
- Funciones puras de utilidad
- Cálculos y transformaciones de datos
- Validaciones
- Obligatorio: Tests para lógica crítica (`calculations.ts`)

**`docs/`**
- Solo lectura desde agentes
- Si necesitas actualizar docs, pide confirmación al usuario primero
- PRD.md y SECURITY.md no deben editarse sin que el usuario lo solicite explícitamente

**`config/`**
- Cambios cuidadosos y bien probados
- ESLint/Prettier/Tailwind config solo si hay razón válida
- Siempre comunica cambios al usuario

## 🔄 Flujo de Desarrollo

### 1. Antes de Empezar
```bash
pnpm install              # Asegurar dependencias actualizadas
pnpm dev                  # Iniciar servidor de desarrollo
```

### 2. Hacer Cambios
- Edita archivos en `src/`
- El servidor Vite recargará automáticamente (HMR)
- Mantén TypeScript sin errores

### 3. Verificar Calidad
```bash
pnpm lint                 # Validar ESLint
pnpm test                 # Ejecutar tests
```

### 4. Commit
```bash
git add <files>
git commit -m "feat/fix/docs: descripción clara"
```

**Formato de commit:**
- `feat:` nuevas características
- `fix:` correcciones de bugs
- `refactor:` cambios de código sin alterar funcionalidad
- `docs:` cambios en documentación
- `test:` agregar o actualizar tests
- `chore:` cambios de configuración/dependencias

## ✅ Checklist Antes de Commit

- [ ] Código compila sin errores TypeScript
- [ ] `pnpm lint` pasa sin warnings
- [ ] `pnpm test` pasa todas las pruebas
- [ ] Cambios son pequeños y enfocados
- [ ] Commit message es descriptivo
- [ ] No hay `console.log` o `debugger` en producción
- [ ] No hay `any` types sin justificación

## 🚫 Prohibido Hacer Sin Autorización

1. **Cambios de stack/dependencias principales:**
   - Cambiar React, TypeScript, Vite
   - Reemplazar Tailwind o Radix UI
   - Cambiar pnpm por npm/yarn

2. **Cambios destructivos:**
   - Eliminar funcionalidades sin confirmar
   - Cambiar tipos críticos (`Subject`, `Evaluation`, `Config`)
   - Alterar API de cálculos

3. **Cambios de arquitectura:**
   - Agregar backend/servidor
   - Cambiar estructura de carpetas base
   - Agregar dependencias externas grandes

4. **Cambios en datos/persistencia:**
   - Cambiar estructura de localStorage
   - Eliminar/renombrar claves de persistencia sin migración

## ✨ Bienvenido Hacer Sin Autorización

1. **Mejorar código:**
   - Refactorización que preserve funcionalidad
   - Simplificación de lógica compleja
   - Mejora de nombres de variables/funciones
   - Agregar tipos más específicos

2. **Mejorar documentación:**
   - Actualizar README
   - Mejorar comentarios de código
   - Agregar ejemplos
   - Corregir errores de documentación

3. **Agregar tests:**
   - Tests unitarios para lógica
   - Tests de integración
   - Aumentar cobertura

4. **Optimizaciones:**
   - Mejora de performance
   - Reducción de bundle size
   - Optimizar re-renders
   - Mejorar accesibilidad

5. **Correcciones:**
   - Bugs en cálculos
   - Bugs en UI
   - Errores tipográficos
   - Problemas de accesibilidad

## 🔍 Validación de Cambios

### Tests
```bash
# Ejecutar tests
pnpm test

# Ver cobertura
pnpm test:coverage

# Modo watch para desarrollo
pnpm test:watch
```

### Linting
```bash
# Verificar estilo de código
pnpm lint

# Los warnings deben ser mínimos
```

### Compilación TypeScript
```bash
# Compilar y verificar tipos
pnpm build
```

## 📚 Recursos Útiles

- [Documentación técnica](./docs/ARCHITECTURE.md)
- [Guía de contribución](./docs/CONTRIBUTING.md)
- [Guía de configuración](./docs/SETUP.md)
- [Tipos del proyecto](./src/types.ts)

## 💬 Comunicación

### Cuando pedir confirmación:
- ¿Cambiar dependencias principales? Confirma
- ¿Eliminar funcionalidad? Confirma
- ¿Cambiar estructura de datos persistentes? Confirma
- ¿Refactorización de componentes críticos? Avisa pero procede

### Cuando notificar al usuario:
- Cambios significativos completados
- Nuevas funcionalidades implementadas
- Problemas encontrados
- Preguntas sobre requerimientos

### Cuando trabajar silenciosamente:
- Correcciones de bugs
- Mejoras de documentación
- Refactorizaciones seguras
- Actualizaciones de tipos

## 🎯 Objetivos de Calidad

- **Código**: TypeScript strict, sin `any`, tipos explícitos
- **Tests**: Cobertura > 80% para lógica crítica
- **Documentación**: Actualizada y clara
- **Performance**: Sin re-renders innecesarios
- **Accesibilidad**: WCAG 2.1 AA cuando sea posible
- **UX**: Consistente con diseño actual

## 📝 Notas Finales

Este proyecto es una aplicación académica con propósito educativo. Los cambios deben:
1. Mejorar la experiencia del usuario
2. Mantener la claridad del código
3. Seguir las convenciones establecidas
4. Ser bien documentados

---

## 🔀 Estrategia de Ramas (Git)

- **`main`**: Rama de producción. Los push a `main` disparan el deploy automático a GitHub Pages
- **`develop`**: Rama de desarrollo activo. Los cambios se hacen aquí primero
- **Pull Requests**: De `develop` → `main` cuando se quiere hacer release
- **Feature branches**: Opcional, desde `develop` para features grandes

**Regla**: Nunca hacer push directo a `main` sin pasar por `develop` o un PR.

## 🛣️ Aliases de Importación

El proyecto usa path alias `@/*` → `src/*` (configurado en `tsconfig.json` y `vite.config.ts`):

```typescript
// ✅ Correcto
import { cn } from '@/lib/utils'
import { Subject } from '@/types'

// ❌ Evitar rutas relativas largas
import { cn } from '../../../lib/utils'
```

**Regla**: Usar `@/` para imports desde `src/`. Las rutas relativas solo son aceptables para archivos en la misma carpeta o carpeta inmediatamente adyacente.

## 🗄️ Registro de Claves de localStorage

Las claves de `localStorage` siguen el prefijo `gapto10-`:

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `gapto10-subjects` | `Subject[]` | Lista de materias del usuario |
| `gapto10-config` | `Partial<Config>` | Configuración personalizada (solo diferencias del default) |
| `gapto10-welcome-shown` | `boolean` | Si el diálogo de bienvenida ya se mostró |
| `gapto10-subject-order` | `string[]` | IDs de materias en orden personalizado |

**Reglas**:
- Nuevas claves DEBEN usar el prefijo `gapto10-`
- Agregar nuevas claves a esta tabla al crearlas
- No almacenar datos sensibles en localStorage
- Usar `useLocalStorage` hook para acceder (sincroniza entre tabs)

## 🎨 Convenciones de Estilos

### Tailwind CSS + `cn()`

Usar la utilidad `cn()` de `@/lib/utils` para combinar clases condicionalmente:

```typescript
// ✅ Correcto
<div className={cn("p-4 rounded-lg", isActive && "bg-primary text-white")} />

// ❌ No usar template literals para condicionales
<div className={`p-4 rounded-lg ${isActive ? 'bg-primary' : ''}`} />
```

### Componentes UI (shadcn/Radix)

- Los componentes en `src/components/ui/` siguen el patrón shadcn (wrappers sobre Radix UI)
- No modificar componentes UI sin razón — son base compartida
- Para nuevos componentes UI, seguir el mismo patrón de los existentes
- Variantes con `class-variance-authority` (`cva`)

### Iconos

El proyecto usa **Phosphor Icons** (`@phosphor-icons/react`):

```typescript
// ✅ Importar iconos individuales
import { House, GearSix, Plus } from '@phosphor-icons/react'

// ❌ No usar lucide-react para nuevos iconos (legacy, solo en componentes ui/)
```

**Nota**: `lucide-react` existe como dependencia pero solo se usa internamente en componentes `ui/`. Para componentes de features, usar siempre Phosphor Icons.

## 🧩 Patrones de Estado

### Estado Global en App.tsx

Todo el estado global vive en `App.tsx` y se pasa por props:

```
App.tsx (estado) → props → Componentes hijos → handlers → actualizar estado
```

**Reglas**:
- No agregar Context API ni state managers (Redux, Zustand, etc.) sin autorización
- Props drilling es aceptable dado el tamaño del proyecto
- Usar `useMemo` para cálculos derivados costosos
- Los handlers que modifican estado se definen en `App.tsx` y se pasan como props

### Navegación Interna

La "navegación" es un simple estado `view`:

```typescript
const [view, setView] = useState<'dashboard' | 'subject' | 'semester'>('dashboard')
```

No hay router. No agregar `react-router` sin autorización.

## 📣 Notificaciones (Toasts)

Usar `sonner` para feedback al usuario:

```typescript
import { toast } from 'sonner'

toast.success('Materia creada')
toast.error('Error al importar datos')
```

**Regla**: Usar toasts solo para acciones del usuario (crear, editar, eliminar, importar/exportar). No para estados derivados o cálculos.

## 🚨 Manejo de Errores

- `react-error-boundary` con `ErrorFallback.tsx` envuelve la app
- Errores de localStorage se capturan con try/catch en `useLocalStorage`
- Validación de datos importados antes de aplicar

## 🚀 CI/CD y Deploy

### GitHub Pages (Automático)

- **Trigger**: Push a `main` o dispatch manual
- **Pipeline**: `.github/workflows/deploy.yml`
- **URL**: `https://jrgil20.github.io/gapto10-cfpp/`
- **Base URL**: Se detecta automáticamente con `process.env.CI`

### Build

```bash
pnpm build    # tsc -b && vite build → dist/
```

- Chunks separados: `vendor` (react, react-dom) y `ui` (radix)
- Minificación con Terser
- Sin sourcemaps en producción

**Regla**: Verificar que `pnpm build` pasa antes de hacer merge a `main`.

## 📅 Manejo de Fechas

Usar **date-fns** para manipulación de fechas:

```typescript
import { differenceInDays } from 'date-fns'
```

- Formato de fechas: `YYYY-MM-DD` (string ISO en los tipos)
- No usar `moment.js` ni `dayjs`

## 🧪 Convenciones de Testing

- Framework: **Vitest** (entorno `node`)
- Tests co-ubicados: `calculations.test.ts` junto a `calculations.ts`
- Prioridad de testing: `src/lib/calculations.ts` es el archivo más crítico
- Ejecutar `pnpm test` antes de cualquier commit que toque lógica de cálculos

## 🔢 Configuración por Defecto

Valores default definidos en `src/lib/configUtils.ts`:

| Campo | Default | Descripción |
|-------|---------|-------------|
| `defaultMaxPoints` | `20` | Puntos máximos por evaluación |
| `percentagePerPoint` | `5` | % que vale cada punto |
| `passingPercentage` | `50` | % mínimo para aprobar |
| `showJsonInExportImport` | `false` | Mostrar JSON raw en diálogo |
| `roundingType` | `'standard'` | Tipo de redondeo |

**Regla**: Al agregar nuevas opciones de Config, agregarlas a `DEFAULT_CONFIG` en `configUtils.ts` y al tipo `Config` en `types.ts`. La función `normalizeConfig` las incluirá automáticamente.
