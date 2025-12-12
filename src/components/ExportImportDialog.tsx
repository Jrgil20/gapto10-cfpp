import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Subject, Config } from '../types'
import { Download, Upload, CheckCircle, XCircle } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ExportImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'export' | 'import'
  subjects?: Subject[]
  config?: Config
  onConfirm: () => void
  importData?: {
    subjects: Subject[]
    config: Config
    exportDate?: string
  }
  showJson?: boolean
}

export function ExportImportDialog({
  open,
  onOpenChange,
  mode,
  subjects = [],
  config,
  onConfirm,
  importData,
  showJson = false
}: ExportImportDialogProps) {
  const dataToShow = mode === 'export' 
    ? { subjects, config, exportDate: new Date().toISOString() }
    : importData

  if (!dataToShow) return null

  // Preparar JSON para mostrar
  const jsonData = mode === 'export'
    ? JSON.stringify({ subjects, config, exportDate: new Date().toISOString() }, null, 2)
    : JSON.stringify(importData, null, 2)

  const totalEvaluations = dataToShow.subjects.reduce(
    (sum, subject) => sum + subject.evaluations.length,
    0
  )
  
  const completedEvaluations = dataToShow.subjects.reduce(
    (sum, subject) => sum + subject.evaluations.filter(e => e.obtainedPoints !== undefined).length,
    0
  )

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'export' ? (
              <>
                <Download size={20} />
                Exportar Datos
              </>
            ) : (
              <>
                <Upload size={20} />
                Importar Datos
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'export' 
              ? 'Revisa los datos que se exportarán a continuación'
              : 'Revisa los datos que se importarán. Esto reemplazará tus datos actuales.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {showJson ? (
            /* Vista JSON */
            <Card className="p-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-sm">JSON {mode === 'export' ? 'a exportar' : 'a importar'}</h3>
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto font-mono">
                  {jsonData}
                </pre>
              </div>
            </Card>
          ) : (
            <>
              {/* Resumen general */}
              <Card className="p-4">
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-sm">Resumen</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Materias</span>
                  <span className="font-semibold text-lg">{dataToShow.subjects.length}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Evaluaciones</span>
                  <span className="font-semibold text-lg">
                    {completedEvaluations} / {totalEvaluations}
                  </span>
                </div>
              </div>
              {mode === 'import' && importData?.exportDate && (
                <div className="pt-2 border-t">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">Fecha de exportación</span>
                    <span className="font-medium">
                      {format(new Date(importData.exportDate), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Configuración */}
          {dataToShow.config && (
            <Card className="p-4">
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-sm">Configuración</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Puntos máximos</span>
                    <span className="font-semibold">{dataToShow.config.defaultMaxPoints}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">% por punto</span>
                    <span className="font-semibold">{dataToShow.config.percentagePerPoint}%</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">% para aprobar</span>
                    <span className="font-semibold">{dataToShow.config.passingPercentage}%</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Lista de materias */}
          <Card className="p-4">
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-sm">Materias ({dataToShow.subjects.length})</h3>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {dataToShow.subjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay materias para {mode === 'export' ? 'exportar' : 'importar'}
                  </p>
                ) : (
                  dataToShow.subjects.map((subject) => {
                    const completed = subject.evaluations.filter(e => e.obtainedPoints !== undefined).length
                    return (
                      <div
                        key={subject.id}
                        className="flex items-start justify-between p-3 border rounded-lg bg-muted/30"
                      >
                        <div className="flex flex-col gap-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{subject.name}</span>
                            {subject.hasSplit && (
                              <div className="flex gap-1">
                                <Badge variant="outline" className="text-xs">
                                  T: {subject.theoryWeight}%
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  P: {subject.practiceWeight}%
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{subject.evaluations.length} evaluaciones</span>
                            <span className="flex items-center gap-1">
                              {completed > 0 ? (
                                <>
                                  <CheckCircle size={12} className="text-accent" />
                                  {completed} completadas
                                </>
                              ) : (
                                <>
                                  <XCircle size={12} className="text-muted-foreground" />
                                  Sin completar
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </Card>
            </>
          )}

          {mode === 'import' && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Advertencia: Esta acción reemplazará todos tus datos actuales.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            {mode === 'export' ? (
              <>
                <Download className="mr-2" size={16} />
                Exportar
              </>
            ) : (
              <>
                <Upload className="mr-2" size={16} />
                Confirmar Importación
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
