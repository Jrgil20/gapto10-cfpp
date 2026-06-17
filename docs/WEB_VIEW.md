# 🌐 Guía de la Vista Web - GapTo10

Esta guía te mostrará cómo usar la interfaz web de GapTo10 para gestionar tus materias y calcular las notas que necesitas.

## 📋 Índice

1. [Interfaz Principal](#interfaz-principal)
2. [Dashboard de Materias](#dashboard-de-materias)
3. [Gestionar Materias](#gestionar-materias)
4. [Agregar Evaluaciones](#agregar-evaluaciones)
5. [Vista Semestral](#vista-semestral)
6. [Configuración](#configuración)
7. [Exportar/Importar Datos](#exportarimportar-datos)

## 🎨 Interfaz Principal

### Estructura General

```
┌─────────────────────────────────────────────┐
│  GapTo10 | Materias | Config | Vista Semestral │
├─────────────────────────────────────────────┤
│                                               │
│           Contenido Principal                │
│                                               │
└─────────────────────────────────────────────┘
```

### Elementos del Header

- **Menú de Materias** (≡): Abre el panel lateral con la lista de materias
- **Título**: Muestra el nombre de la aplicación o materia actual
- **Información**: Consejos y ayuda
- **Vista Semestral** (📊): Cambiar a la vista de resumen semestral
- **Configuración** (⚙️): Opciones de configuración general

## 📊 Dashboard de Materias

El Dashboard muestra todas tus materias en forma de tarjetas con información rápida.

### Información en cada tarjeta

- **Nombre de la materia**
- **Evaluaciones**: Total y cantidad completadas
- **División Teoría/Práctica** (si aplica): Porcentajes de cada sección
- **Puntuación actual**: Puntos obtenidos / puntos totales
- **Pendiente por evaluar**: Puntos que falta por calificar
- **Barra de progreso**: Visualización de avance
- **Indicador de estado**: Ícono que muestra si puedes aprobar, estás en riesgo o es imposible

### Controles del Dashboard

- **Botón "Nueva Materia"**: Crear una nueva materia
- **Botón "Vista Semestral"**: Ver resumen de todas tus materias
- **Controles de Ordenamiento**: Organizar materias por:
  - Peor primero (default)
  - Mejor primero
  - Orden alfabético (A-Z)
  - Orden alfabético (Z-A)
  - Manual (arrastra para reorganizar)

## 🎓 Gestionar Materias

### Crear una Nueva Materia

1. Haz clic en **"Nueva Materia"**
2. Completa los campos:
   - **Nombre**: Nombre de la materia
   - **¿Tiene división?**: Si la materia tiene teoría y práctica separadas
     - Si No: procede al paso 3
     - Si Sí: especifica los porcentajes de teoría y práctica
3. Haz clic en **"Crear"**

### Editar o Eliminar una Materia

1. Abre el **Menú de Materias** (≡)
2. Busca la materia
3. Para eliminar: haz clic en el icono de **basura** (🗑️)

### Seleccionar una Materia

Haz clic en la tarjeta de la materia para ver sus detalles y evaluar.

## 📝 Agregar Evaluaciones

### Vista de Materia

Una vez seleccionada una materia, verás:

- **Información de la materia**
- **Lista de evaluaciones** con estado de cada una
- **Barra de progreso** general y por sección (si tiene división)
- **Cálculo de notas necesarias**

### Agregar Evaluación

1. Haz clic en **"Nueva Evaluación"**
2. Completa:
   - **Nombre**: Nombre de la evaluación
   - **Fecha**: Cuándo se realizará (opcional)
   - **Peso**: Porcentaje de ponderación
   - **Máximo de puntos**: Cantidad de puntos (default: 20)
   - **Sección**: Si es Teoría o Práctica (si la materia tiene división)
3. Haz clic en **"Guardar"**

### Registrar Notas Obtenidas

1. En la lista de evaluaciones, localiza la evaluación
2. Haz clic en el campo de puntos
3. Ingresa la nota obtenida
4. Se actualizará automáticamente el cálculo de notas necesarias

### Editar Evaluación

1. Haz clic en el **icono de editar** (✏️) en la evaluación
2. Modifica los campos
3. Haz clic en **"Guardar"**

### Eliminar Evaluación

1. Haz clic en el **icono de basura** (🗑️)
2. Confirma la eliminación

## 📈 Vista Semestral

La Vista Semestral proporciona un resumen de todas tus materias.

### Tabs Disponibles

#### Resumen
- **Resumen General**: Estadísticas de todas tus materias
- **Ranking de Urgencia**: Materias ordenadas por necesidad de acción

#### Próximas Evaluaciones
- Calendario de evaluaciones próximas
- Ordenadas por fecha
- Información de cada evaluación

### Indicadores

- **Aprobadas**: Materias que ya tienes aseguradas
- **En Riesgo**: Materias donde aún puedes cambiar el resultado
- **Imposibles**: Materias donde ya no puedes aprobar

## ⚙️ Configuración

Accede a la configuración haciendo clic en el icono de **engranaje** (⚙️).

### Opciones Disponibles

1. **Máximo de Puntos por Defecto**
   - Define el número de puntos estándar (default: 20)
   - Se aplica a nuevas evaluaciones

2. **Porcentaje por Punto**
   - Define cuánto porcentaje equivale cada punto (default: 5%)
   - Máximo de puntos = 100 / Porcentaje por punto

3. **Porcentaje de Aprobación**
   - Define qué porcentaje es necesario para aprobar (default: 50%)

4. **Tipo de Redondeo**
   - **Estándar**: Redondea según reglas matemáticas
   - **Hacia Arriba**: Siempre redondea al alza
   - **Hacia Abajo**: Siempre redondea a la baja

5. **Mostrar JSON en Exportación**
   - Activa/desactiva la visualización del JSON al exportar

## 💾 Exportar/Importar Datos

### Exportar Datos

1. Abre el **Menú de Materias** (≡)
2. Haz clic en **"Exportar Datos"**
3. Elige opción:
   - **Exportar Datos**: Descarga un archivo con todos tus datos (incluye notas)
   - **Exportar como Template**: Descarga solo la estructura (sin notas)
4. El archivo se descarga automáticamente

### Importar Datos

1. Abre el **Menú de Materias** (≡)
2. Haz clic en **"Importar Datos"**
3. Selecciona un archivo JSON válido
4. Revisa la vista previa
5. Haz clic en **"Confirmar Importación"**

## 🧮 Modos de Cálculo

GapTo10 ofrece tres estrategias de cálculo:

### 🛡️ Modo Pesimista (Default)
Calcula la nota **mínima** necesaria para aprobar, asumiendo que obtendrás 0 en las evaluaciones pendientes.

**Caso de uso**: Cuando solo quieres pasar y necesitas saber el mínimo absoluto.

### ⚖️ Modo Normal
Proyecta tu desempeño basándose en tu rendimiento **actual**.

**Caso de uso**: Para una proyección realista de lo que necesitas.

### 🚀 Modo Optimista
Calcula la nota necesaria para alcanzar una **meta ambiciosa** (80%).

**Caso de uso**: Cuando quieres destacarte en la materia.

### Cambiar el Modo
En la vista de materia, encontrarás un selector para cambiar el modo de cálculo.

## 🎯 Consejos Útiles

- **Actualiza regularmente**: Ingresa tus notas apenas las recibas
- **Revisa el Dashboard**: Mantente atento a materias en riesgo
- **Usa Vista Semestral**: Ten una visión global de tu semestre
- **Exporta periódicamente**: Respalda tus datos regularmente
- **Configura según tu contexto**: Ajusta máximo de puntos y porcentaje de aprobación

## 🐛 Reportar Problemas

Si encuentras algún problema o tienes sugerencias:

1. Abre un [issue en GitHub](https://github.com/Jrgil20/gapto10-cfpp/issues)
2. Describe el problema con detalle
3. Si es posible, incluye pasos para reproducirlo

## 📞 Contacto y Soporte

- **GitHub**: [Jrgil20/gapto10-cfpp](https://github.com/Jrgil20/gapto10-cfpp)
- **Issues**: [Reportar problema](https://github.com/Jrgil20/gapto10-cfpp/issues)
