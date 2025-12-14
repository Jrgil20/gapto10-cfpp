import { Config } from '../types'

/**
 * Configuración por defecto del sistema.
 * Estos son los valores que se usan cuando no se especifica un valor diferente.
 */
export const DEFAULT_CONFIG: Required<Config> = {
  defaultMaxPoints: 20,
  percentagePerPoint: 5,
  passingPercentage: 50,
  showJsonInExportImport: false,
  roundingType: 'standard'
}

/**
 * Normaliza una configuración aplicando los valores por defecto para campos faltantes.
 * Esto asegura retrocompatibilidad con configuraciones antiguas que no tienen todos los campos.
 * 
 * Esta función itera dinámicamente sobre las claves de DEFAULT_CONFIG, por lo que
 * automáticamente incluirá cualquier nueva propiedad agregada sin necesidad de modificar
 * esta función manualmente.
 * 
 * @param config - Configuración parcial o completa
 * @returns Configuración completa con todos los campos definidos
 */
export function normalizeConfig(config: Partial<Config> | undefined | null): Required<Config> {
  if (!config) {
    return { ...DEFAULT_CONFIG }
  }

  const normalized = { ...DEFAULT_CONFIG }

  // Iterar dinámicamente sobre las claves de DEFAULT_CONFIG
  // Esto asegura que cualquier nueva propiedad se incluya automáticamente
  for (const key in DEFAULT_CONFIG) {
    if (key in config) {
      const configValue = (config as any)[key]
      if (configValue !== undefined && configValue !== null) {
        ;(normalized as any)[key] = configValue
      }
    }
  }

  return normalized
}

/**
 * Minimiza una configuración eliminando los valores que son iguales a los por defecto.
 * Esto reduce el tamaño del archivo de exportación y hace el sistema más eficiente.
 * 
 * Esta función itera dinámicamente sobre las claves de DEFAULT_CONFIG, por lo que
 * automáticamente incluirá cualquier nueva propiedad agregada sin necesidad de modificar
 * esta función manualmente.
 * 
 * @param config - Configuración completa o parcial
 * @returns Configuración parcial solo con valores que difieren del default, o undefined si todos son default
 */
export function minimizeConfig(config: Config | Partial<Config> | undefined | null): Partial<Config> | undefined {
  if (!config) {
    return undefined
  }

  const normalized = normalizeConfig(config)
  const minimized: Partial<Config> = {}

  // Iterar dinámicamente sobre las claves de DEFAULT_CONFIG
  // Esto asegura que cualquier nueva propiedad se incluya automáticamente
  for (const key in DEFAULT_CONFIG) {
    if (key in normalized) {
      const configValue = normalized[key as keyof Required<Config>]
      const defaultValue = DEFAULT_CONFIG[key as keyof typeof DEFAULT_CONFIG]
      
      // Solo agregar campos que difieren del default
      if (configValue !== defaultValue) {
        ;(minimized as any)[key] = configValue
      }
    }
  }

  // Retornar undefined si no hay diferencias (configuración es default)
  return Object.keys(minimized).length > 0 ? minimized : undefined
}

/**
 * Compara dos configuraciones para determinar si son iguales.
 * 
 * Esta función itera dinámicamente sobre las claves de DEFAULT_CONFIG, por lo que
 * automáticamente incluirá cualquier nueva propiedad agregada sin necesidad de modificar
 * esta función manualmente.
 * 
 * @param config1 - Primera configuración
 * @param config2 - Segunda configuración
 * @returns true si las configuraciones normalizadas son iguales
 */
export function configsAreEqual(config1: Config | undefined, config2: Config | undefined): boolean {
  const norm1 = normalizeConfig(config1)
  const norm2 = normalizeConfig(config2)
  
  // Iterar dinámicamente sobre las claves de DEFAULT_CONFIG
  // Esto asegura que cualquier nueva propiedad se compare automáticamente
  for (const key in DEFAULT_CONFIG) {
    const value1 = norm1[key as keyof Required<Config>]
    const value2 = norm2[key as keyof Required<Config>]
    
    if (value1 !== value2) {
      return false
    }
  }
  
  return true
}
