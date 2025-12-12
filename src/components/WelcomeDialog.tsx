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

          {/* Consejo flotante sobre exportar/importar */}
          <Card className="p-4 bg-accent/10 border-accent/20 relative">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-accent/20 p-2 shrink-0">
                <Lightbulb size={20} className="text-accent" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <Download size={16} className="text-accent" />
                  <Upload size={16} className="text-accent" />
                  <h4 className="font-semibold text-sm">Consejo útil</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Recuerda <strong>exportar tus datos</strong> regularmente para poder acceder a ellos desde cualquier dispositivo. Puedes exportar e importar tus materias y evaluaciones desde el menú de configuración.
                </p>
              </div>
            </div>
          </Card>

          {/* Consejo sobre GitHub */}
          <Card className="p-4 bg-primary/10 border-primary/20 relative">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/20 p-2 shrink-0">
                <GithubLogo size={20} className="text-primary" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-primary" />
                  <h4 className="font-semibold text-sm">¿Te gusta la app?</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Si GapTo10 te resulta útil, considera <strong>darle una estrella</strong> al repositorio en GitHub, échale un vistazo y deja un issue si tienes algún problema o sugerencia.
                </p>
                <a
                  href="https://github.com/Jrgil20/gapto10-cfpp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline mt-1 flex items-center gap-1 w-fit"
                >
                  <GithubLogo size={14} />
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
