# Sistema de Gestión de Notas Académicas

Una aplicación web de página única para gestionar y calcular las notas necesarias en diferentes evaluaciones académicas, considerando pesos porcentuales y la posibilidad de división entre teoría y práctica.

**Experience Qualities**:
1. **Eficiente** - La interfaz debe permitir entrada rápida de datos y cálculos instantáneos de notas necesarias
2. **Clara** - Los resultados de los cálculos deben ser fáciles de entender con visualización inmediata del estado de aprobación
3. **Precisa** - Los cálculos deben ser exactos considerando todos los escenarios (pesimista, normal, optimista) y las divisiones teoría/práctica

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
Esta aplicación requiere múltiples funcionalidades avanzadas: gestión de materias, evaluaciones con pesos variables, cálculos dinámicos con tres estrategias diferentes, división teoría/práctica, persistencia de datos, y exportación/importación JSON.

## Essential Features

### 1. Gestión de Materias
- **Functionality**: Crear, editar y eliminar materias académicas con opción de división teoría/práctica
- **Purpose**: Organizar las evaluaciones por asignatura y permitir cálculos separados cuando se requiere
- **Trigger**: Usuario hace clic en "Nueva Materia" desde el dashboard
- **Progression**: Click botón → Dialog abre → Ingresa nombre y selecciona si es teoría/práctica → Define porcentajes si aplica (ej: 70% teoría, 30% práctica) → Guarda → Materia aparece en lista
- **Success criteria**: Las materias se persisten correctamente y aparecen en el menú lateral, mostrando división si aplica

### 2. Gestión de Evaluaciones
- **Functionality**: Agregar evaluaciones a cada materia con nombre, fecha, peso porcentual y sistema de puntos
- **Purpose**: Definir la estructura de calificaciones de cada materia
- **Trigger**: Usuario selecciona una materia y hace clic en "Agregar Evaluación"
- **Progression**: Click "Agregar Evaluación" → Dialog abre → Ingresa nombre, fecha, peso % → Define puntos máximos (default 20) → Guarda → Evaluación aparece en tabla
- **Success criteria**: Las evaluaciones se guardan con sus pesos y la suma de pesos se valida (debe ser 100% total o 100% por sección)

### 3. Ingreso de Notas Obtenidas
- **Functionality**: Registrar la nota obtenida en cada evaluación realizada
- **Purpose**: Mantener registro de calificaciones para calcular notas necesarias en evaluaciones pendientes
- **Trigger**: Usuario hace clic en campo de nota en evaluación existente
- **Progression**: Click en campo → Input numérico aparece → Ingresa nota → Presiona Enter o sale del campo → Nota se guarda → Cálculos se actualizan automáticamente
- **Success criteria**: La nota se guarda y los cálculos de notas necesarias se recalculan instantáneamente

### 4. Cálculo de Notas Necesarias (Pesimista)
- **Functionality**: Calcular las notas mínimas requeridas en evaluaciones pendientes para aprobar
- **Purpose**: Estrategia defensiva que distribuye el esfuerzo según el peso (evaluaciones de mayor peso requieren menos nota)
- **Trigger**: Automático al ingresar o cambiar notas
- **Progression**: Usuario ingresa nota → Sistema detecta evaluaciones pendientes → Calcula distribución optimizando por peso → Muestra notas necesarias en cada evaluación pendiente
- **Success criteria**: Las notas calculadas suman exactamente el mínimo para aprobar (50%), priorizando notas más bajas en evaluaciones de mayor peso

### 5. Cálculo de Notas Necesarias (Normal)
- **Functionality**: Calcular notas esperadas basándose en el rendimiento actual del estudiante
- **Purpose**: Estrategia realista que proyecta el rendimiento actual hacia evaluaciones pendientes
- **Trigger**: Automático al ingresar o cambiar notas, usuario puede cambiar a vista "Normal"
- **Progression**: Usuario tiene notas ingresadas → Sistema analiza promedio ponderado actual → Proyecta notas similares según peso de evaluaciones → Muestra meta realista (11-13/20)
- **Success criteria**: Las notas calculadas reflejan el patrón de rendimiento actual y suman a una meta razonable

### 6. Cálculo de Notas Necesarias (Optimista)
- **Functionality**: Calcular notas necesarias para alcanzar una meta específica (ej: 19/20 final)
- **Purpose**: Estrategia ambiciosa donde el usuario define su objetivo de nota final
- **Trigger**: Usuario activa modo optimista e ingresa nota objetivo
- **Progression**: Click modo "Optimista" → Input aparece para meta → Ingresa nota deseada (ej: 95%) → Sistema calcula distribución necesaria → Muestra notas requeridas en cada evaluación
- **Success criteria**: Las notas calculadas suman exactamente la meta ingresada, distribuyendo equitativamente según pesos

### 7. Validación Teoría/Práctica
- **Functionality**: Verificar aprobación individual de teoría y práctica cuando están separadas
- **Purpose**: Asegurar que el estudiante cumpla requisitos de aprobación separados incluso si el promedio general es suficiente
- **Trigger**: Automático al calcular notas en materias con división teoría/práctica
- **Progression**: Sistema calcula → Verifica porcentaje teoría ≥ 50% de su peso → Verifica porcentaje práctica ≥ 50% de su peso → Muestra estado individual de cada sección
- **Success criteria**: La aplicación muestra claramente si cada sección está aprobada o reprobada independientemente del total

### 8. Exportación de Datos
- **Functionality**: Generar archivo JSON con todas las materias, evaluaciones y notas
- **Purpose**: Permitir respaldo y transferencia de datos entre dispositivos
- **Trigger**: Usuario hace clic en "Exportar" en configuración
- **Progression**: Click "Exportar" → Sistema serializa datos a JSON → Descarga automática de archivo → Usuario guarda archivo localmente
- **Success criteria**: El archivo JSON contiene toda la información y puede ser importado posteriormente

### 9. Importación de Datos
- **Functionality**: Cargar archivo JSON previamente exportado
- **Purpose**: Restaurar datos desde respaldo o migrar desde otro dispositivo
- **Trigger**: Usuario hace clic en "Importar" y selecciona archivo
- **Progression**: Click "Importar" → File picker abre → Usuario selecciona JSON → Sistema valida formato → Carga datos → Reemplaza o merge con datos existentes → Muestra confirmación
- **Success criteria**: Los datos importados se cargan correctamente y todos los cálculos funcionan como esperado

### 10. Configuración del Sistema
- **Functionality**: Ajustar parámetros globales como sistema de puntos por defecto y conversión de porcentajes a notas
- **Purpose**: Permitir personalización según el sistema educativo específico del usuario
- **Trigger**: Usuario hace clic en ícono de configuración
- **Progression**: Click configuración → Panel abre → Usuario ajusta: puntos máximos default (20), conversión % a nota (cada 5% = 1 punto) → Guarda → Configuración se aplica a nuevas evaluaciones
- **Success criteria**: Los cambios de configuración se persisten y se aplican correctamente a los cálculos

## Edge Case Handling

- **Pesos no suman 100%**: Mostrar advertencia visual y no permitir cálculos hasta corregir
- **División teoría/práctica incorrecta**: Validar que porcentajes sumen 100% antes de guardar
- **Nota ingresada supera máximo**: Mostrar error y no permitir guardar hasta corregir
- **Sin evaluaciones pendientes**: Mostrar solo promedio actual y estado de aprobación
- **Importación de JSON inválido**: Mostrar mensaje de error claro sin afectar datos existentes
- **Meta optimista imposible**: Indicar cuando ya no es matemáticamente posible alcanzar la meta
- **Fechas de evaluaciones**: Permitir ingresar fechas pasadas y futuras sin restricción

## Design Direction

La interfaz debe evocar sensaciones de claridad académica, organización metódica y confianza en los cálculos. Debe sentirse como una herramienta profesional pero accesible, con énfasis en la legibilidad de números y estados de aprobación. Los colores deben comunicar inmediatamente el estado (aprobado/reprobado/en progreso).

## Color Selection

Un esquema académico moderno con énfasis en estados claros y legibilidad óptima de datos numéricos.

- **Primary Color**: oklch(0.45 0.15 250) - Azul académico profundo que comunica seriedad y confianza
- **Secondary Colors**: 
  - oklch(0.92 0.02 250) - Azul muy claro para fondos sutiles
  - oklch(0.35 0.12 250) - Azul oscuro para textos importantes
- **Accent Color**: oklch(0.65 0.20 145) - Verde esmeralda para estados aprobados y acciones positivas
- **Destructive/Warning**: oklch(0.60 0.22 25) - Naranja cálido para estados reprobados (menos agresivo que rojo)
- **Foreground/Background Pairings**:
  - Background (oklch(0.98 0.005 250)): Foreground oklch(0.20 0.01 250) - Ratio 14.8:1 ✓
  - Primary (oklch(0.45 0.15 250)): White oklch(1 0 0) - Ratio 6.2:1 ✓
  - Accent (oklch(0.65 0.20 145)): White oklch(1 0 0) - Ratio 4.9:1 ✓
  - Warning (oklch(0.60 0.22 25)): White oklch(1 0 0) - Ratio 5.1:1 ✓

## Font Selection

Tipografía que equilibra legibilidad de datos numéricos con calidez profesional, evitando la frialdad de fuentes monoespaciadas puras.

- **Primary Font**: Inter - Para interfaz general, excelente legibilidad en pantallas
- **Data Font**: JetBrains Mono - Para números y datos numéricos, claridad en dígitos
- **Typographic Hierarchy**:
  - H1 (Nombre de Materia): Inter Bold / 24px / -0.02em letter spacing
  - H2 (Secciones): Inter Semibold / 18px / -0.01em letter spacing
  - Body (Textos generales): Inter Regular / 14px / normal letter spacing
  - Data (Notas y porcentajes): JetBrains Mono Medium / 16px / tabular numbers
  - Labels (Campos): Inter Medium / 13px / 0.01em letter spacing
  - Small (Ayudas): Inter Regular / 12px / normal letter spacing

## Animations

Las animaciones deben reforzar la causa-efecto en los cálculos y proporcionar feedback inmediato al ingresar datos. Sutiles pero presentes.

- **Transiciones de estado**: 200ms ease para cambios de color en estados aprobado/reprobado
- **Actualización de cálculos**: Pulse suave (scale 1.02) en números recalculados durante 300ms
- **Apertura de dialogs**: Spring animation (framer-motion) para sensación de materialidad
- **Hover en cards de materia**: Lift sutil (translateY -2px) con shadow en 150ms
- **Ingreso de datos**: Input focus con expand del border en 200ms
- **Exportar/Importar**: Success checkmark con bounce en 400ms

## Component Selection

- **Components**:
  - **Sheet**: Para menú hamburguesa lateral con lista de materias (mobile-first)
  - **Dialog**: Para crear/editar materias y evaluaciones
  - **Card**: Para cada materia en vista de lista y cada evaluación en tabla
  - **Table**: Para mostrar evaluaciones con columnas (nombre, fecha, peso, puntos, nota obtenida, nota necesaria)
  - **Input**: Para ingresar notas y datos numéricos con validación en tiempo real
  - **Button**: Para acciones primarias (agregar, guardar, exportar) con variants según importancia
  - **Badge**: Para mostrar porcentajes de peso y estados de aprobación
  - **Tabs**: Para alternar entre modos de cálculo (Pesimista, Normal, Optimista)
  - **Select**: Para elegir materias rápidamente en vistas compactas
  - **Switch**: Para toggle de división teoría/práctica
  - **Separator**: Para dividir secciones teoría/práctica visualmente
  - **Progress**: Para mostrar porcentaje acumulado hacia aprobación
  - **Alert**: Para advertencias sobre pesos incorrectos o metas imposibles
  - **Popover**: Para configuración rápida sin salir de contexto

- **Customizations**:
  - **NumericInput**: Input especializado para notas con formato automático (X/20), validación de rango
  - **EvaluationRow**: Componente custom para fila de tabla con estados visuales claros
  - **CalculationCard**: Card especializada mostrando los tres tipos de cálculo lado a lado
  - **SubjectHeader**: Header con nombre de materia, porcentaje actual, y estado de aprobación

- **States**:
  - **Buttons**: Default (solid primary), Hover (brightness +10%), Active (scale 0.98), Disabled (opacity 40%)
  - **Inputs**: Default (border-input), Focus (ring-2 ring-primary), Error (border-destructive + red glow), Success (border-accent subtle)
  - **Cards**: Default (border subtle), Hover (shadow-md + border-primary/20), Selected (border-primary + bg-primary/5)
  - **Badges**: Approved (bg-accent/10 text-accent border-accent/20), Failed (bg-destructive/10 text-destructive border-destructive/20), Pending (bg-muted)

- **Icon Selection**:
  - Plus (agregar materia/evaluación)
  - List (menú hamburguesa)
  - Calculator (modos de cálculo)
  - Download/Upload (exportar/importar)
  - Gear (configuración)
  - CheckCircle (aprobado)
  - WarningCircle (reprobado/alerta)
  - Calendar (fechas)
  - Percent (pesos porcentuales)
  - TrendUp (modo optimista)
  - TrendDown (modo pesimista)
  - Equals (modo normal)

- **Spacing**:
  - Container padding: p-4 (mobile), p-6 (desktop)
  - Card internal: p-4
  - Section gaps: gap-6 (principal), gap-4 (secundario), gap-2 (compacto)
  - Input spacing: mb-4 entre campos de formulario
  - Table row padding: py-3 px-4

- **Mobile**:
  - Menú hamburguesa con Sheet completo en mobile
  - Tabla de evaluaciones se convierte en cards apiladas
  - Tabs de cálculo horizontales con scroll en mobile
  - Dialogs ocupan 95% del viewport en mobile
  - Inputs con height mínimo de 44px para touch
  - Botones de acción sticky al bottom en mobile
  - Configuración en Sheet full-screen en mobile
