import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Plus } from '@phosphor-icons/react'

interface SubEvaluationCreatorProps {
  baseName: string
  count: string
  onBaseNameChange: (value: string) => void
  onCountChange: (value: string) => void
  onCreate: () => void
  weight?: string
  showAddMoreButton?: boolean
  onAddMore?: () => void
  variant?: 'initial' | 'additional'
}

/**
 * Componente reutilizable para crear múltiples sub-evaluaciones
 * Se usa tanto cuando no hay sub-evaluaciones como cuando ya existen
 */
export function SubEvaluationCreator({
  baseName,
  count,
  onBaseNameChange,
  onCountChange,
  onCreate,
  weight = '0',
  showAddMoreButton = false,
  onAddMore,
  variant = 'initial'
}: SubEvaluationCreatorProps) {
  const canCreate = baseName.trim().length > 0 && parseInt(count) >= 1

  return (
    <div className="flex flex-col gap-3">
      {variant === 'initial' ? (
        <>
          <p className="text-sm text-muted-foreground">
            Crea múltiples sub-evaluaciones (ej: Pruebas virtuales). El peso de {weight}% se repartirá equitativamente entre todas.
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="sub-eval-base-name" className="text-xs">Nombre base</Label>
                <Input
                  id="sub-eval-base-name"
                  placeholder="Ej: Prueba virtual"
                  value={baseName}
                  onChange={(e) => onBaseNameChange(e.target.value)}
                />
              </div>
              <div className="w-24">
                <Label htmlFor="sub-eval-count" className="text-xs">Cantidad</Label>
                <Input
                  id="sub-eval-count"
                  type="number"
                  min="1"
                  max="20"
                  value={count}
                  onChange={(e) => onCountChange(e.target.value)}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onCreate}
              disabled={!canCreate}
            >
              <Plus size={16} className="mr-1" />
              Crear sub-evaluaciones
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Podrás agregar más sub-evaluaciones después de crear estas.
          </p>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              El peso de {weight}% se repartirá equitativamente entre todas las sub-evaluaciones.
            </p>
            {showAddMoreButton && onAddMore && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAddMore}
              >
                <Plus size={16} className="mr-1" />
                Agregar más
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="sub-eval-base-name-existing" className="text-xs">Nombre base</Label>
                <Input
                  id="sub-eval-base-name-existing"
                  placeholder="Ej: Prueba virtual"
                  value={baseName}
                  onChange={(e) => onBaseNameChange(e.target.value)}
                />
              </div>
              <div className="w-24">
                <Label htmlFor="sub-eval-count-existing" className="text-xs">Cantidad</Label>
                <Input
                  id="sub-eval-count-existing"
                  type="number"
                  min="1"
                  max="20"
                  value={count}
                  onChange={(e) => onCountChange(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCreate}
                  disabled={!canCreate}
                >
                  <Plus size={14} className="mr-1" />
                  Crear
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
