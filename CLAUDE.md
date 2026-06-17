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

¡Bienvenido a trabajar en GapTo10! 🚀
