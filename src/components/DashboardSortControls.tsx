import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { DotsSixVertical, ArrowsDownUp } from '@phosphor-icons/react'

export type SortMode = 
  | 'manual'           // Orden manual (drag-and-drop)
  | 'worst-first'       // Peor desempeño primero
  | 'best-first'        // Mejor desempeño primero
  | 'alphabetical-asc'  // Alfabético A-Z
  | 'alphabetical-desc'  // Alfabético Z-A

interface DashboardSortControlsProps {
  sortMode: SortMode
  onSortModeChange: (mode: SortMode) => void
  isDragging?: boolean
}

/**
 * Componente de controles para ordenar el dashboard.
 * Permite seleccionar entre orden manual (drag-and-drop) y varios filtros automáticos.
 */
export function DashboardSortControls({ 
  sortMode, 
  onSortModeChange,
  isDragging = false
}: DashboardSortControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <DotsSixVertical 
        size={20} 
        className={`text-muted-foreground transition-opacity ${isDragging ? 'opacity-100' : 'opacity-50'}`}
        weight={isDragging ? 'fill' : 'regular'}
      />
      <Select value={sortMode} onValueChange={(value) => onSortModeChange(value as SortMode)}>
        <SelectTrigger className="w-[200px] sm:w-[240px]">
          <div className="flex items-center gap-2">
            <ArrowsDownUp size={16} className="text-muted-foreground" />
            <SelectValue placeholder="Ordenar por..." />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">
            <div className="flex items-center gap-2">
              <DotsSixVertical size={16} />
              <span>Orden manual</span>
            </div>
          </SelectItem>
          <SelectItem value="worst-first">
            <span>Peor desempeño primero</span>
          </SelectItem>
          <SelectItem value="best-first">
            <span>Mejor desempeño primero</span>
          </SelectItem>
          <SelectItem value="alphabetical-asc">
            <span>Alfabético (A-Z)</span>
          </SelectItem>
          <SelectItem value="alphabetical-desc">
            <span>Alfabético (Z-A)</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
