import { Config, RoundingType } from '../types'

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
 * @param config - Configuración parcial o completa
 * @returns Configuración completa con todos los campos definidos
 */
export function normalizeConfig(config: Partial<Config> | undefined | null): Required<Config> {
  if (!config) {
    return { ...DEFAULT_CONFIG }
  }

  return {
    defaultMaxPoints: config.defaultMaxPoints ?? DEFAULT_CONFIG.defaultMaxPoints,
    percentagePerPoint: config.percentagePerPoint ?? DEFAULT_CONFIG.percentagePerPoint,
    passingPercentage: config.passingPercentage ?? DEFAULT_CONFIG.passingPercentage,
    showJsonInExportImport: config.showJsonInExportImport ?? DEFAULT_CONFIG.showJsonInExportImport,
    roundingType: config.roundingType ?? DEFAULT_CONFIG.roundingType
  }
}

/**
 * Minimiza una configuración eliminando los valores que son iguales a los por defecto.
 * Esto reduce el tamaño del archivo de exportación y hace el sistema más eficiente.
 * 
 * @param config - Configuración completa
 * @returns Configuración parcial solo con valores que difieren del default, o undefined si todos son default
 */
export function minimizeConfig(config: Config | undefined | null): Partial<Config> | undefined {
  if (!config) {
    return undefined
  }

  const normalized = normalizeConfig(config)
  const minimized: Partial<Config> = {}

  // Solo agregar campos que difieren del default
  if (normalized.defaultMaxPoints !== DEFAULT_CONFIG.defaultMaxPoints) {
    minimized.defaultMaxPoints = normalized.defaultMaxPoints
  }
  
  if (normalized.percentagePerPoint !== DEFAULT_CONFIG.percentagePerPoint) {
    minimized.percentagePerPoint = normalized.percentagePerPoint
  }
  
  if (normalized.passingPercentage !== DEFAULT_CONFIG.passingPercentage) {
    minimized.passingPercentage = normalized.passingPercentage
  }
  
  if (normalized.showJsonInExportImport !== DEFAULT_CONFIG.showJsonInExportImport) {
    minimized.showJsonInExportImport = normalized.showJsonInExportImport
  }
  
  if (normalized.roundingType !== DEFAULT_CONFIG.roundingType) {
    minimized.roundingType = normalized.roundingType
  }

  // Retornar undefined si no hay diferencias (configuración es default)
  return Object.keys(minimized).length > 0 ? minimized : undefined
}

/**
 * Compara dos configuraciones para determinar si son iguales.
 * 
 * @param config1 - Primera configuración
 * @param config2 - Segunda configuración
 * @returns true si las configuraciones normalizadas son iguales
 */
export function configsAreEqual(config1: Config | undefined, config2: Config | undefined): boolean {
  const norm1 = normalizeConfig(config1)
  const norm2 = normalizeConfig(config2)
  
  return (
    norm1.defaultMaxPoints === norm2.defaultMaxPoints &&
    norm1.percentagePerPoint === norm2.percentagePerPoint &&
    norm1.passingPercentage === norm2.passingPercentage &&
    norm1.showJsonInExportImport === norm2.showJsonInExportImport &&
    norm1.roundingType === norm2.roundingType
  )
}
