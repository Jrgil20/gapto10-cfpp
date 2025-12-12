import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { Card } from './ui/card'
import { Info, Download, Upload, Lightbulb, Star, GithubLogo } from '@phosphor-icons/react'

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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Info size={20} className="text-primary shrink-0 sm:hidden" />
            <Info size={24} className="text-primary shrink-0 hidden sm:block" />
            <span>Bienvenido a GapTo10</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Antes de comenzar, es importante que conozcas el propósito de esta herramienta.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 sm:gap-4 py-3 sm:py-4">
          <Alert>
            <AlertDescription className="flex flex-col gap-2 sm:gap-3">
              <p className="font-semibold text-xs sm:text-sm">
                ⚠️ Advertencia Importante
              </p>
              <div className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <p>
                  Esta aplicación <strong>NO promueve</strong> sacar malas notas ni descuidar el aprendizaje.
                </p>
                <p>
                  GapTo10 es únicamente una <strong>herramienta de gestión y cálculo</strong> diseñada para ayudarte a:
                </p>
                <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-muted-foreground">
                  <li>Organizar tus evaluaciones y notas</li>
                  <li>Calcular las notas necesarias para aprobar</li>
                  <li>Visualizar tu progreso académico</li>
                  <li>Planificar tu estudio de manera informada</li>
                </ul>
                <p className="mt-1 sm:mt-2">
                  El objetivo es apoyar tu <strong>aprendizaje responsable</strong>.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Consejo flotante sobre exportar/importar */}
          <Card className="p-3 sm:p-4 bg-accent/10 border-accent/20 relative">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="rounded-full bg-accent/20 p-1.5 sm:p-2 shrink-0">
                <Lightbulb size={16} className="text-accent sm:hidden" />
                <Lightbulb size={20} className="text-accent hidden sm:block" />
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Download size={14} className="text-accent sm:hidden" />
                  <Upload size={14} className="text-accent sm:hidden" />
                  <Download size={16} className="text-accent hidden sm:block" />
                  <Upload size={16} className="text-accent hidden sm:block" />
                  <h4 className="font-semibold text-xs sm:text-sm">Consejo útil</h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Recuerda <strong>exportar tus datos</strong> regularmente para acceder desde cualquier dispositivo.
                </p>
              </div>
            </div>
          </Card>

          {/* Consejo sobre GitHub */}
          <Card className="p-3 sm:p-4 bg-primary/10 border-primary/20 relative">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="rounded-full bg-primary/20 p-1.5 sm:p-2 shrink-0">
                <GithubLogo size={16} className="text-primary sm:hidden" />
                <GithubLogo size={20} className="text-primary hidden sm:block" />
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Star size={14} className="text-primary sm:hidden" />
                  <Star size={16} className="text-primary hidden sm:block" />
                  <h4 className="font-semibold text-xs sm:text-sm">¿Te gusta la app?</h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Dale una <strong>estrella</strong> en GitHub o deja un issue si tienes problemas.
                </p>
                <a
                  href="https://github.com/Jrgil20/gapto10-cfpp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline mt-0.5 sm:mt-1 flex items-center gap-1 w-fit"
                >
                  <GithubLogo size={12} className="sm:hidden" />
                  <GithubLogo size={14} className="hidden sm:block" />
                  Ver en GitHub
                </a>
              </div>
            </div>
          </Card>
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
