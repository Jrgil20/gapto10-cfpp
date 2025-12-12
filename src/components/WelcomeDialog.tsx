import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { Info } from '@phosphor-icons/react'

interface WelcomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
}

export function WelcomeDialog({ open, onOpenChange, onAccept }: WelcomeDialogProps) {
  const handleAccept = () => {
    onAccept()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info size={24} className="text-primary" />
            Bienvenido a GapTo10
          </DialogTitle>
          <DialogDescription>
            Antes de comenzar, es importante que conozcas el propósito de esta herramienta.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <Alert>
            <AlertDescription className="flex flex-col gap-3">
              <p className="font-semibold text-sm">
                ⚠️ Advertencia Importante
              </p>
              <div className="flex flex-col gap-2 text-sm space-y-2">
                <p>
                  Esta aplicación <strong>NO promueve</strong> sacar malas notas ni descuidar el aprendizaje.
                </p>
                <p>
                  GapTo10 es únicamente una <strong>herramienta de gestión y cálculo</strong> diseñada para ayudarte a:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                  <li>Organizar tus evaluaciones y notas</li>
                  <li>Calcular las notas necesarias para aprobar</li>
                  <li>Visualizar tu progreso académico</li>
                  <li>Planificar tu estudio de manera informada</li>
                </ul>
                <p className="mt-2">
                  El objetivo es apoyar tu <strong>aprendizaje responsable</strong> y ayudarte a mantener un seguimiento claro de tu rendimiento académico.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button onClick={handleAccept} className="w-full">
            Entendido, comenzar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
