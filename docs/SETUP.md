# ⚙️ Configuración del Entorno de Desarrollo

Esta guía te ayudará a configurar tu entorno local para desarrollar en GapTo10.

## 📋 Requisitos Previos

- **Node.js** >= 20.0.0
- **pnpm** >= 10.0.0
- **Git**
- Editor de código (VS Code recomendado)

## 🚀 Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jrgil20/gapto10-cfpp.git
cd gapto10-cfpp

# 2. Instalar dependencias
pnpm install

# 3. Iniciar servidor de desarrollo
pnpm dev

# La aplicación estará disponible en http://localhost:5173
```

## 📦 Instalación de Dependencias

### Paso 1: Instalar Node.js

Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/). Se recomienda la versión LTS (v20).

#### Verificar instalación:
```bash
node --version  # v20.x.x o superior
npm --version   # Incluido con Node.js
```

### Paso 2: Instalar pnpm

pnpm es un gestor de paquetes más eficiente que npm.

```bash
# Instalar pnpm globalmente
npm install -g pnpm@10

# Verificar instalación
pnpm --version  # 10.x.x o superior
```

### Paso 3: Clonar el Repositorio

```bash
git clone https://github.com/Jrgil20/gapto10-cfpp.git
cd gapto10-cfpp
```

### Paso 4: Instalar Dependencias del Proyecto

```bash
pnpm install
```

Esto instalará todas las dependencias especificadas en `package.json`.

## 💻 Comandos de Desarrollo

### Servidor de Desarrollo
```bash
pnpm dev
```
Inicia el servidor Vite en `http://localhost:5173` con hot reload.

### Compilar para Producción
```bash
pnpm build
```
Genera los archivos optimizados en la carpeta `dist/`.

### Previsualizar Build de Producción
```bash
pnpm preview
```
Sirve localmente el build de producción para pruebas.

### Linter
```bash
pnpm lint
```
Ejecuta ESLint para verificar la calidad del código.

### Pruebas Unitarias
```bash
pnpm test
```
Ejecuta las pruebas unitarias con Vitest.

### Cobertura de Pruebas
```bash
pnpm test:coverage
```
Genera un reporte de cobertura de código.

## 📁 Estructura de Carpetas

```
gapto10-cfpp/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes de Radix UI
│   │   └── *.tsx           # Componentes principales
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Funciones utilitarias
│   ├── types.ts            # Definiciones de TypeScript
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
├── docs/                   # Documentación
├── public/                 # Archivos estáticos
├── package.json            # Dependencias y scripts
├── tsconfig.json           # Configuración TypeScript
├── vite.config.ts          # Configuración Vite
├── tailwind.config.ts      # Configuración Tailwind
└── README.md               # Documentación principal
```

## 🔧 Configuración del Editor

### VS Code

1. Instala las extensiones recomendadas:
   - **ES7+ React/Redux/React-Native snippets**
   - **ESLint**
   - **Prettier**
   - **TypeScript Vue Plugin (Volar)**

2. Crea `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 🧪 Testing

El proyecto usa **Vitest** para pruebas unitarias.

### Ejecutar Pruebas
```bash
# Ejecutar todas las pruebas
pnpm test

# Modo watch (re-ejecuta al hacer cambios)
pnpm test:watch

# Cobertura de código
pnpm test:coverage
```

### Estructura de Pruebas
```
src/
├── lib/
│   ├── calculations.ts      # Lógica de cálculos
│   └── calculations.test.ts # Pruebas de cálculos
```

## 📚 Tecnologías Utilizadas

- **React 19**: Framework UI
- **TypeScript**: Tipado estático
- **Vite 7**: Bundler y dev server
- **Tailwind CSS 4**: Utilidades CSS
- **Radix UI**: Componentes accesibles
- **Recharts**: Gráficos y visualización
- **dnd-kit**: Drag and drop
- **Sonner**: Notificaciones toast
- **Phosphor Icons**: Iconografía
- **ESLint**: Linting
- **Vitest**: Testing unitario

## 🐛 Resolución de Problemas

### Error: "Command not found: pnpm"
```bash
npm install -g pnpm@10
```

### Error: "Node version is not compatible"
Verifica tu versión de Node.js y actualiza si es necesario:
```bash
node --version  # Debe ser >= 20.0.0
```

### Puerto 5173 ya está en uso
```bash
# Especificar puerto diferente
pnpm dev -- --port 3000
```

### Problemas de instalación
```bash
# Limpiar cache y reinstalar
pnpm install --force
```

## 🚢 Despliegue

### Despliegue a GitHub Pages

El proyecto está configurado para desplegarse automáticamente en GitHub Pages.

```bash
# El build se genera en /dist
pnpm build

# Se despliega automáticamente al hacer push a main
```

### Variables de Entorno

Crea un archivo `.env.local` para variables locales (no se comitea):

```env
VITE_API_URL=http://localhost:3000
```

Para producción, configura las variables en GitHub Actions o en tu servicio de hosting.

## 📝 Convenciones de Código

### Nombrado de Archivos
- Componentes React: `PascalCase.tsx` (ej: `Dashboard.tsx`)
- Hooks: `camelCase.ts` (ej: `useSubjectOrder.ts`)
- Utilidades: `camelCase.ts` (ej: `calculations.ts`)
- Estilos: `camelCase.module.css`

### Componentes
```typescript
// Componentes funcionales
export function ComponentName() {
  return <div>Content</div>
}

// Con props
interface ComponentProps {
  prop1: string
  prop2?: number
}

export function Component({ prop1, prop2 }: ComponentProps) {
  return <div>{prop1}</div>
}
```

### TypeScript
- Siempre especifica tipos para props
- Usa interfaces para objetos complejos
- Evita usar `any` a menos que sea absolutamente necesario

## 🤝 Flujo de Contribución

1. **Fork** el repositorio
2. **Clone** tu fork
3. **Crea una rama** para tu feature: `git checkout -b feature/NombreFeature`
4. **Realiza cambios** y **commits**
5. **Push** a tu fork
6. **Abre un Pull Request**

## 📖 Lectura Recomendada

- [Vite Documentation](https://vitejs.dev/)
- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs/primitives/overview/introduction)

## 💬 Contacto y Soporte

Si tienes dudas sobre la configuración:
- Abre un [issue en GitHub](https://github.com/Jrgil20/gapto10-cfpp/issues)
- Etiqueta como `question`

## ✅ Checklist de Configuración

- [ ] Node.js >= 20.0.0 instalado
- [ ] pnpm >= 10.0.0 instalado
- [ ] Repositorio clonado
- [ ] `pnpm install` completado
- [ ] `pnpm dev` funciona correctamente
- [ ] Aplicación visible en `http://localhost:5173`
- [ ] Editor configurado
- [ ] Extensiones de VS Code instaladas
- [ ] Pruebas ejecutándose: `pnpm test`
