# 🏗️ Arquitectura del Proyecto GapTo10

Esta documento describe la estructura y arquitectura general de GapTo10.

## 📋 Índice

1. [Visión General](#visión-general)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Componentes Principales](#componentes-principales)
4. [Flujo de Datos](#flujo-de-datos)
5. [Hooks Personalizados](#hooks-personalizados)
6. [Utilidades y Cálculos](#utilidades-y-cálculos)
7. [Tipos y Interfaces](#tipos-y-interfaces)
8. [Estado y Persistencia](#estado-y-persistencia)

## 🎯 Visión General

GapTo10 es una aplicación web de **una sola página (SPA)** construida con React que ayuda a estudiantes a gestionar y calcular notas académicas.

### Características Arquitectónicas

- **Rendimiento**: Todos los cálculos ocurren en el cliente (sin servidor)
- **Persistencia Local**: Datos guardados en `localStorage`
- **Tipo Seguro**: TypeScript en todo el proyecto
- **Componentes Reutilizables**: UI agnóstica, lógica reutilizable
- **Sin Backend**: Funciona completamente en el navegador

### Stack Tecnológico

```
┌─────────────────────────────────────────┐
│         React 19 / TypeScript           │
├─────────────────────────────────────────┤
│ Radix UI | Tailwind CSS 4 | Recharts   │
├─────────────────────────────────────────┤
│     Vite 7 (Dev Server & Bundler)       │
├─────────────────────────────────────────┤
│   LocalStorage (Persistencia de Datos)  │
└─────────────────────────────────────────┘
```

## 📁 Estructura de Carpetas

```
src/
├── App.tsx                    # Componente raíz, orquestación de estado
├── main.tsx                  # Punto de entrada
├── types.ts                  # Definiciones de tipos globales
│
├── components/               # Componentes React
│   ├── ui/                   # Componentes de Radix UI personalizados
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   └── ... (otros componentes UI)
│   │
│   ├── Dashboard.tsx         # Componente del dashboard de materias
│   ├── SubjectView.tsx       # Vista detallada de una materia
│   ├── SemesterView.tsx      # Vista semestral general
│   │
│   ├── SubjectDialog.tsx     # Modal para crear/editar materia
│   ├── EvaluationDialog.tsx  # Modal para crear/editar evaluación
│   ├── ConfigDialog.tsx      # Modal de configuración
│   ├── ExportImportDialog.tsx # Modal de exportación/importación
│   │
│   ├── ProgressBar.tsx       # Barra de progreso
│   ├── ProgressVisualization.tsx # Visualización de progreso
│   ├── StatusIndicator.tsx   # Indicador de estado
│   ├── HistoricalChart.tsx   # Gráfico histórico
│   │
│   ├── SemesterSummary.tsx   # Resumen semestral
│   ├── UrgencyRanking.tsx    # Ranking de urgencia
│   ├── UpcomingEvaluations.tsx # Próximas evaluaciones
│   │
│   ├── DashboardSortControls.tsx # Controles de ordenamiento
│   ├── SubEvaluationCreator.tsx  # Creador de sub-evaluaciones
│   └── ... (otros componentes)
│
├── hooks/                    # Custom React hooks
│   ├── useLocalStorage.ts    # Hook para localStorage
│   ├── useSubjectOrder.ts    # Hook para ordenamiento de materias
│   └── use-mobile.ts         # Hook para detectar dispositivo móvil
│
├── lib/                      # Funciones utilitarias
│   ├── calculations.ts       # Lógica de cálculo de notas
│   ├── calculations.test.ts  # Tests de cálculos
│   ├── configUtils.ts        # Utilidades de configuración
│   ├── utils.ts              # Utilidades generales
│   └── calculations.ts       # Lógica principal de cálculos
│
└── ErrorFallback.tsx        # Componente para manejo de errores
```

## 🧩 Componentes Principales

### Jerarquía de Componentes

```
App
├── Header
│   ├── Sheet (Menú lateral)
│   │   └── Lista de Materias
│   ├── Botones de Navegación
│   └── Configuración
│
├── Main
│   ├── Dashboard (vista='dashboard')
│   │   └── SortableSubjectCard (x N)
│   │
│   ├── SubjectView (vista='subject')
│   │   ├── Información de Materia
│   │   ├── Lista de Evaluaciones
│   │   └── Cálculo de Notas
│   │
│   └── SemesterView (vista='semester')
│       ├── Tabs
│       │   ├── Resumen
│       │   │   ├── SemesterSummary
│       │   │   └── UrgencyRanking
│       │   └── Próximas Evaluaciones
│       │       └── UpcomingEvaluations
│       └── Botón Volver
│
├── Footer
│
└── Diálogos (Portales)
    ├── SubjectDialog
    ├── EvaluationDialog
    ├── ConfigDialog
    ├── ExportImportDialog
    └── WelcomeDialog
```

### Componentes Clave

#### `App.tsx`
El componente raíz que:
- Gestiona todo el estado global
- Maneja las transiciones entre vistas
- Orquesta los diálogos
- Interactúa con `localStorage`

```typescript
// Estado principal
const [subjects, setSubjects] = useLocalStorage<Subject[]>('gapto10-subjects', [])
const [config, setConfig] = useLocalStorage<Partial<Config>>('gapto10-config', undefined)
const [view, setView] = useState<'dashboard' | 'subject' | 'semester'>('dashboard')
```

#### `Dashboard.tsx`
Muestra todas las materias en formato de tarjetas:
- Usa `dnd-kit` para drag & drop
- Implementa múltiples modos de ordenamiento
- Calcula estado y progreso en tiempo real

#### `SubjectView.tsx`
Muestra detalles de una materia individual:
- Lista completa de evaluaciones
- Cálculo de notas necesarias
- Interfaz para editar evaluaciones

#### `SemesterView.tsx`
Proporciona visión global del semestre:
- Resumen de todas las materias
- Ranking de urgencia
- Próximas evaluaciones

## 🔄 Flujo de Datos

### Estado Global (unidireccional)

```
App (Estado)
    ↓
    ├→ subjects: Subject[]
    ├→ config: Config
    ├→ view: string
    └→ [otros estados]
         ↓
    Componentes (Props)
         ↓
    Handlers (setters)
         ↓
    Actualización de Estado
         ↓
    localStorage
```

### Ciclo de Actualización de Datos

```
Usuario Interactúa
    ↓
Evento en Componente
    ↓
Handler (ej: handleSaveEvaluation)
    ↓
setSubjects([...]) (actualiza estado)
    ↓
useLocalStorage persiste
    ↓
Componente re-renderiza
    ↓
Cálculos se recalculan (useMemo)
    ↓
UI Se actualiza
```

## 🎣 Hooks Personalizados

### `useLocalStorage.ts`

Hook que proporciona persistencia de estado:

```typescript
const [subjects, setSubjects] = useLocalStorage<Subject[]>(
  'gapto10-subjects',
  []
)
```

- Carga datos al inicializar
- Persiste cambios automáticamente
- Sincroniza entre tabs

### `useSubjectOrder.ts`

Hook para gestionar orden de materias:

```typescript
const { getOrderedSubjects, reorderSubjects } = useSubjectOrder(subjects)
```

- Obtiene materias en orden configurado
- Gestiona reordenamiento manual
- Persiste orden en localStorage

### `use-mobile.ts`

Hook para detectar si es dispositivo móvil:

```typescript
const isMobile = useMobile()
```

- Detecta breakpoint de Tailwind
- Permite layouts responsivos

## 🧮 Utilidades y Cálculos

### `calculations.ts`

Contiene toda la lógica de cálculos académicos:

```typescript
// Cálculo de notas necesarias
calculateRequiredNotes(subject: Subject, config: Config): Calculation

// Cálculo de resumen semestral
getSemesterSummary(subjects: Subject[], config: Config): SemesterSummary

// Conversión de porcentaje a puntos
percentageToPoints(percentage: number, ...): number

// Estado del progreso
getProgressStatus(data: ProgressStatusData): StatusInfo
```

**Funcionalidades**:
- Tres modos de cálculo (pesimista, normal, optimista)
- Validación de teoría/práctica separadas
- Cálculo de imposibilidades
- Redondeo configurable

### `configUtils.ts`

Gestiona configuración con valores por defecto:

```typescript
// Normaliza configuración con defaults
normalizeConfig(config?: Partial<Config>): Config

// Minimiza configuración (solo diferencias del default)
minimizeConfig(config: Config): Partial<Config> | undefined
```

**Ventajas**:
- Garantiza campos requeridos
- Permite añadir nuevas opciones sin romper compatibilidad
- Reduce tamaño de almacenamiento

## 🔤 Tipos y Interfaces

### Tipos Principales (`types.ts`)

```typescript
interface Subject {
  id: string
  name: string
  hasSplit: boolean
  theoryWeight?: number      // 0-100
  practiceWeight?: number    // 0-100
  evaluations: Evaluation[]
}

interface Evaluation {
  id: string
  name: string
  date?: string              // YYYY-MM-DD
  weight: number             // 0-100
  maxPoints: number
  obtainedPoints?: number
  section?: 'theory' | 'practice'
  isSummative?: boolean
  subEvaluations?: SubEvaluation[]
}

interface Config {
  defaultMaxPoints: number   // Default: 20
  percentagePerPoint: number // Default: 5
  passingPercentage: number  // Default: 50
  showJsonInExportImport: boolean // Default: false
  roundingType: 'standard' | 'up' | 'down' // Default: 'standard'
}

interface Calculation {
  currentPercentage: number
  currentTheoryPercentage?: number
  currentPracticePercentage?: number
  requiredPoints: number
  // ... otros campos
}
```

## 💾 Estado y Persistencia

### LocalStorage

El proyecto usa `localStorage` para persistencia:

```
gapto10-subjects        → Subject[]
gapto10-config          → Partial<Config>
gapto10-welcome-shown   → boolean
gapto10-subject-order   → string[] (IDs de materias)
```

### Sincronización Entre Tabs

El hook `useLocalStorage` escucha eventos `storage`:
- Cambios en un tab se reflejan en otros
- Sincronización automática

### Exportación/Importación

```typescript
interface ExportData {
  subjects: Subject[]
  config?: Partial<Config>
  exportDate: string
}
```

- Formato: JSON
- Soporta importación parcial
- Validación de datos al importar

## 🔐 Flujo de Autenticación

No hay autenticación en GapTo10:
- Datos completamente locales
- Sin servidor backend
- Privacidad garantizada

## 📊 Cálculos Específicos

### Modo Pesimista (Default)

```
Nota Necesaria = ((Porcentaje de Aprobación - Porcentaje Actual) / 
                  Porcentaje Pendiente) * 100
```

Asume que obtendrás 0 en evaluaciones pendientes.

### Modo Normal

Proyecta basándose en rendimiento actual:
```
Rendimiento = Porcentaje Actual / Porcentaje Evaluado
Proyección = Rendimiento * Porcentaje Pendiente
```

### Modo Optimista

Calcula para alcanzar 80% final:
```
Nota Necesaria = (80 - Porcentaje Actual) / Porcentaje Pendiente
```

## ♿ Accesibilidad

El proyecto usa **Radix UI** para componentes accesibles:
- ARIA labels
- Navegación por teclado
- Contraste de colores apropiado
- Screen reader support

## 🎨 Tema y Estilos

### Tailwind CSS 4

- Utility-first approach
- Variables CSS personalizadas
- Breakpoints responsivos
- Dark mode support

### Paleta de Colores

```
primary     - Color principal (acciones)
secondary   - Color secundario
accent      - Color de énfasis
destructive - Para peligros/eliminaciones
muted       - Texto y borders secundarios
```

## 🚀 Optimizaciones

### Performance

- `useMemo` para cálculos costosos
- `useCallback` para handlers estables
- Code splitting con Vite
- Lazy loading de componentes

### Bundle Size

- Tree-shaking automático
- Radix UI sin componentes no usados
- Iconografía minimalista (Phosphor Icons)

## 🧪 Testing

### Estructura de Tests

```
src/
├── lib/
│   ├── calculations.ts
│   └── calculations.test.ts  ← Tests
```

### Cobertura

- Pruebas unitarias para cálculos
- Vitest para testing
- Coverage mínimo del 80%

## 📦 Build y Deployment

### Build Process

```bash
pnpm build
    ↓
Vite transpila TypeScript
    ↓
Tailwind genera CSS
    ↓
Assets se optimizan
    ↓
/dist (listo para producción)
```

### GitHub Pages Deployment

- Automático al hacer push a `main`
- GitHub Actions pipeline
- Versión en vivo: https://jrgil20.github.io/gapto10-cfpp/

## 🔍 Monitoreo y Debugging

### Desarrollo

```bash
pnpm dev
```

- Hot Module Reload (HMR) habilitado
- Sourcemaps para debugging
- React DevTools compatible

### Logging

```typescript
console.log('Debug message')  // Solo en desarrollo
```

Se eliminan automáticamente en producción.

## 📈 Escalabilidad Futura

Posibles expansiones:

1. **Backend**: Sincronización en la nube
2. **Autenticación**: Google/GitHub login
3. **Colaboración**: Compartir materias
4. **Analytics**: Estadísticas avanzadas
5. **API**: Integración con plataformas educativas

---

**Última actualización**: 2026-06-17
