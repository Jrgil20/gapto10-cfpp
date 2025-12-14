import { useState, useEffect } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Subject, Evaluation, Config, CalculationMode } from './types'
import { SubjectDialog } from './components/SubjectDialog'
import { EvaluationDialog } from './components/EvaluationDialog'
import { SubjectView } from './components/SubjectView'
import { ConfigDialog } from './components/ConfigDialog'
import { Dashboard } from './components/Dashboard'
import { ExportImportDialog } from './components/ExportImportDialog'
import { WelcomeDialog } from './components/WelcomeDialog'
import { Button } from './components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from './components/ui/sheet'
import { Card } from './components/ui/card'
import { Separator } from './components/ui/separator'
import { toast } from 'sonner'
import { List, Plus, GearSix, Download, Upload, Trash, House, ArrowLeft, Question, Lightbulb, Star, GithubLogo, Info, Warning, Copy, FileText } from '@phosphor-icons/react'
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover'
import { Alert, AlertDescription } from './components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './components/ui/dialog'
import { ScrollArea } from './components/ui/scroll-area'
import { calculateRequiredNotes } from './lib/calculations'

function App() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('gapto10-subjects', [])
  const [config, setConfig] = useLocalStorage<Config>('gapto10-config', {
    defaultMaxPoints: 20,
    percentagePerPoint: 5,
    passingPercentage: 50,
    showJsonInExportImport: false
  })

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false)
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false)
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | undefined>(undefined)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('pessimistic')
  const [view, setView] = useState<'dashboard' | 'subject'>('dashboard')
  const [exportImportDialogOpen, setExportImportDialogOpen] = useState(false)
  const [exportImportMode, setExportImportMode] = useState<'export' | 'import'>('export')
  const [importData, setImportData] = useState<{ subjects: Subject[]; config: Config; exportDate?: string } | undefined>(undefined)
  const [welcomeShown, setWelcomeShown] = useLocalStorage<boolean>('gapto10-welcome-shown', false)
  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false)
  const [promptDialogOpen, setPromptDialogOpen] = useState(false)

  const subjectsData = subjects || []
  const configData = config || {
    defaultMaxPoints: 20,
    percentagePerPoint: 5,
    passingPercentage: 50,
    showJsonInExportImport: false,
    roundingType: 'standard'
  }

  const selectedSubject = subjectsData.find(s => s.id === selectedSubjectId)

  const handleSaveSubject = (subjectData: Omit<Subject, 'id' | 'evaluations'>) => {
    setSubjects((currentSubjects) => [
      ...(currentSubjects || []),
      {
        ...subjectData,
        id: Date.now().toString(),
        evaluations: []
      }
    ])
    toast.success('Materia creada')
  }

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((currentSubjects) => (currentSubjects || []).filter(s => s.id !== subjectId))
    if (selectedSubjectId === subjectId) {
      setSelectedSubjectId(null)
      setView('dashboard')
    }
    toast.success('Materia eliminada')
  }

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId)
    setView('subject')
    setSheetOpen(false)
  }

  const handleBackToDashboard = () => {
    setSelectedSubjectId(null)
    setView('dashboard')
  }

  const handleSaveEvaluation = (evaluationData: Omit<Evaluation, 'id'>) => {
    if (!selectedSubjectId) return

    if (editingEvaluation) {
      setSubjects((currentSubjects) =>
        (currentSubjects || []).map((subject) => {
          if (subject.id === selectedSubjectId) {
            return {
              ...subject,
              evaluations: subject.evaluations.map((eval_) =>
                eval_.id === editingEvaluation.id
                  ? {
                      ...evaluationData,
                      id: eval_.id
                    }
                  : eval_
              )
            }
          }
          return subject
        })
      )
      toast.success('Evaluación actualizada')
      setEditingEvaluation(undefined)
    } else {
      setSubjects((currentSubjects) =>
        (currentSubjects || []).map((subject) => {
          if (subject.id === selectedSubjectId) {
            return {
              ...subject,
              evaluations: [
                ...subject.evaluations,
                {
                  ...evaluationData,
                  id: Date.now().toString()
                }
              ]
            }
          }
          return subject
        })
      )
      toast.success('Evaluación agregada')
    }
  }

  const handleSaveMultipleEvaluations = (evaluations: Omit<Evaluation, 'id'>[]) => {
    if (!selectedSubjectId) return

    setSubjects((currentSubjects) =>
      (currentSubjects || []).map((subject) => {
        if (subject.id === selectedSubjectId) {
          const newEvaluations = evaluations.map((evalData, index) => ({
            ...evalData,
            id: `${Date.now()}-${index}`
          }))
          
          return {
            ...subject,
            evaluations: [...subject.evaluations, ...newEvaluations]
          }
        }
        return subject
      })
    )
    toast.success(`${evaluations.length} evaluaciones agregadas`)
  }

  const handleEditEvaluation = (evaluation: Evaluation) => {
    setEditingEvaluation(evaluation)
    setEvaluationDialogOpen(true)
  }

  const handleUpdateNote = (evaluationId: string, points: number | undefined) => {
    if (!selectedSubjectId) return

    setSubjects((currentSubjects) =>
      (currentSubjects || []).map((subject) => {
        if (subject.id === selectedSubjectId) {
          return {
            ...subject,
            evaluations: subject.evaluations.map((eval_) =>
              eval_.id === evaluationId
                ? { ...eval_, obtainedPoints: points }
                : eval_
            )
          }
        }
        return subject
      })
    )
  }

  const handleDeleteEvaluation = (evaluationId: string) => {
    if (!selectedSubjectId) return

    setSubjects((currentSubjects) =>
      (currentSubjects || []).map((subject) => {
        if (subject.id === selectedSubjectId) {
          return {
            ...subject,
            evaluations: subject.evaluations.filter((eval_) => eval_.id !== evaluationId)
          }
        }
        return subject
      })
    )
    toast.success('Evaluación eliminada')
  }

  const handleExport = () => {
    setExportImportMode('export')
    setExportImportDialogOpen(true)
  }

  const handleConfirmExport = () => {
    const data = {
      subjects: subjectsData,
      config: configData,
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `notas-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Datos exportados')
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          
          // Validar estructura básica
          if (!data.subjects || !Array.isArray(data.subjects)) {
            toast.error('Error al importar: archivo inválido - falta array de materias')
            return
          }

          // Mostrar diálogo de preview
          setImportData({
            subjects: data.subjects,
            config: data.config || configData,
            exportDate: data.exportDate
          })
          setExportImportMode('import')
          setExportImportDialogOpen(true)
        } catch (_error) {
          toast.error('Error al importar: archivo inválido')
        }
      }
      reader.readAsText(file)
    }
    
    input.click()
  }

  const handleConfirmImport = () => {
    if (!importData) return

    if (importData.subjects && Array.isArray(importData.subjects)) {
      setSubjects(importData.subjects)
    }
    if (importData.config) {
      setConfig(importData.config)
    }
    
    toast.success('Datos importados correctamente')
    setImportData(undefined)
  }

  const calculation = selectedSubject && configData
    ? calculateRequiredNotes(selectedSubject, configData)
    : null

  // Mostrar diálogo de bienvenida solo la primera vez y si no hay datos
  useEffect(() => {
    if (!welcomeShown && subjectsData.length === 0) {
      setWelcomeDialogOpen(true)
    }
  }, [welcomeShown, subjectsData.length])

  const handleAcceptWelcome = () => {
    setWelcomeShown(true)
  }

  const promptText = `# Prompt para Convertir Materias a JSON Estructurado

## Objetivo
Convertir información de materias académicas y sus evaluaciones a un formato JSON estructurado para un sistema de gestión de calificaciones.

## Instrucciones Generales

### Paso 1: Analizar la información proporcionada
Lee cuidadosamente toda la información sobre las materias, evaluaciones, fechas y pesos porcentuales.

### Paso 2: Identificar la estructura de cada materia
Para cada materia determina:
- ¿La materia tiene división entre teoría y práctica? 
  - Si menciona "teoría y práctica" o "lab y teoría" → \`hasSplit: true\`
  - Si no hay división → \`hasSplit: false\`

### Paso 3: Generar el JSON siguiendo esta estructura

\`\`\`json
{
  "subjects": [
    // Array de materias
  ],
  "config": {
    "defaultMaxPoints": 20,
    "percentagePerPoint": 5,
    "passingPercentage": 50,
    "showJsonInExportImport": true
  },
  "exportDate": "FECHA_ACTUAL_ISO"
}
\`\`\`

## Estructura de Materia SIN División

\`\`\`json
{
  "name": "Nombre de la materia",
  "hasSplit": false,
  "id": "TIMESTAMP_UNICO",
  "evaluations": [
    {
      "name": "Nombre de la evaluación",
      "date": "YYYY-MM-DD",
      "weight": PESO_PORCENTUAL,
      "maxPoints": 20,
      "id": "TIMESTAMP_UNICO-INDEX",
      "obtainedPoints": NOTA_OBTENIDA  // Solo si ya se realizó
    }
  ]
}
\`\`\`

## Estructura de Materia CON División

\`\`\`json
{
  "name": "Nombre de la materia",
  "hasSplit": true,
  "theoryWeight": PESO_TEORIA,      // Ej: 70
  "practiceWeight": PESO_PRACTICA,  // Ej: 30
  "id": "TIMESTAMP_UNICO",
  "evaluations": [
    {
      "name": "Nombre de la evaluación",
      "date": "YYYY-MM-DD",
      "weight": PESO_PORCENTUAL_DENTRO_SECCION,
      "maxPoints": 20,
      "section": "theory",  // o "practice"
      "id": "TIMESTAMP_UNICO-INDEX",
      "obtainedPoints": NOTA_OBTENIDA  // Opcional
    }
  ]
}
\`\`\`

## Reglas Importantes

### IDs
- ID de materia: timestamp único (ej: "1765467948707")
- ID de evaluación: timestamp-índice (ej: "1765467981415-0")
- Usa timestamps simulados incrementales para mantener unicidad

### Fechas
- Formato: "YYYY-MM-DD"
- Si no se proporciona fecha, usa una fecha futura estimada

### Pesos (weight)
- Deben sumar 100% dentro de su contexto
- En materias sin split: suma total = 100%
- En materias con split: 
  - Suma de evaluaciones "theory" = 100% dentro de teoría
  - Suma de evaluaciones "practice" = 100% dentro de práctica
  - theoryWeight + practiceWeight = 100%

### Puntos Obtenidos (obtainedPoints)
- Solo incluir si la evaluación ya fue calificada
- Si no se proporciona, omitir el campo (no poner null ni 0)

### maxPoints
- Por defecto: 20 (configurable en config)
- Puede variar según la evaluación

## ejemplo del Input 

\`\`\`
Fecha Actividades de evaluación Ponderación

16/10/25 Taller en Parejas. 10% (2 pts.)

30/10/25 Prueba Escrita 1. 25% (5 pts.)

20/11/25 Presentación Oral 1 20% (4 pts.)

11/12/25 Presentación Oral 2 20% (4 pts.)

18/12/25 o 08/01/26 Prueba Escrita 2. 25% (5 pts.)

Total: 100% (20 pts.)
\`\`\`

## Proceso de Conversión Paso a Paso

1. **Identificar materias**: Contar cuántas materias hay
2. **Para cada materia**:
   - Extraer nombre
   - Determinar si tiene split
   - Si tiene split: extraer pesos de teoría/práctica
   - Generar ID único
3. **Para cada evaluación**:
   - Extraer nombre
   - Convertir fecha a formato YYYY-MM-DD
   - Extraer peso (convertir porcentajes a números)
   - Identificar maxPoints (o usar 20 por defecto)
   - Si hay nota obtenida, incluir obtainedPoints
   - Si la materia tiene split, asignar section ("theory" o "practice")
   - Generar ID único
4. **Validar pesos**: Verificar que sumen 100% en cada contexto
5. **Generar JSON completo** con config y exportDate

## Notas Adicionales

- Si falta información, usar valores por defecto razonables
- Mantener consistencia en nombres (primera letra mayúscula)
- Respetar acentos y caracteres especiales en español
- Los pesos decimales son válidos (ej: 12.5, 14.5)
- La fecha de exportación debe ser la fecha actual en formato ISO

---

**Uso**: Copia este prompt y proporciona la información de tus materias en lenguaje natural. El sistema generará automáticamente el JSON estructurado siguiendo estas reglas.`

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText)
      toast.success('Prompt copiado al portapapeles')
    } catch (_error) {
      toast.error('Error al copiar el prompt')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <List size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-80">
                <SheetHeader>
                  <SheetTitle>Materias</SheetTitle>
                  <SheetDescription>
                    Gestiona tus materias y evaluaciones
                  </SheetDescription>
                </SheetHeader>
                
                <div className="flex flex-col gap-4 mt-6">
                  <Button onClick={() => setSubjectDialogOpen(true)} className="w-full">
                    <Plus className="mr-2" />
                    Nueva Materia
                  </Button>

                  <Separator />

                  <div className="flex flex-col gap-2">
                    {subjectsData.map((subject) => (
                      <Card
                        key={subject.id}
                        className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                          selectedSubjectId === subject.id
                            ? 'border-primary bg-primary/5'
                            : ''
                        }`}
                        onClick={() => handleSelectSubject(subject.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col gap-1 flex-1">
                            <h3 className="font-semibold">{subject.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {subject.evaluations.length} evaluaciones
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSubject(subject.id)
                            }}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </Card>
                    ))}

                    {subjectsData.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No hay materias registradas
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" onClick={handleExport} className="w-full">
                      <Download className="mr-2" />
                      Exportar Datos
                    </Button>
                    <Button variant="outline" onClick={handleImport} className="w-full">
                      <Upload className="mr-2" />
                      Importar Datos
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {view === 'subject' && selectedSubject ? (
              <Button variant="ghost" size="icon" onClick={handleBackToDashboard} className="shrink-0">
                <ArrowLeft size={20} className="text-primary" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={handleBackToDashboard} className="shrink-0">
                <House size={20} weight="fill" className="text-accent" />
              </Button>
            )}

            {view === 'subject' && selectedSubject ? (
              <h1 className="text-base sm:text-xl font-bold truncate">{selectedSubject.name}</h1>
            ) : (
              <div className="flex flex-col min-w-0">
                <h1 className="text-lg sm:text-xl font-bold leading-tight flex flex-wrap items-baseline">
                  <span className="text-foreground shrink-0">GapTo10</span>
                  <span className="hidden sm:inline text-sm sm:text-base ml-2 text-muted-foreground">
                    {' - '}
                    {'Cuánto Falta Para Pasar'.split('').map((char, i) => (
                      <span key={i} className={/[A-ZÁÉÍÓÚÑ]/.test(char) ? 'text-primary' : 'text-muted-foreground'}>
                        {char}
                      </span>
                    ))}
                  </span>
                </h1>
                <p className="text-xs hidden sm:block">
                  {'Gestor de Notas Académicas'.split('').map((char, i) => (
                    <span key={i} className={/[A-ZÁÉÍÓÚÑ]/.test(char) ? 'text-primary' : 'text-muted-foreground'}>
                      {char}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                  <Question size={18} className="sm:hidden" />
                  <Question size={20} className="hidden sm:block" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Info size={16} className="text-primary" />
                      Consejos y Ayuda
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Información útil sobre GapTo10
                    </p>
                  </div>

                  {/* Advertencia simple */}
                  <Alert variant="destructive" className="py-2">
                    <Warning size={16} />
                    <AlertDescription className="text-xs">
                      Esta aplicación NO promueve sacar malas notas. Es una herramienta de gestión y cálculo para apoyar tu aprendizaje responsable.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col gap-3">
                    {/* Consejo sobre exportar/importar */}
                    <Card className="p-3 bg-accent/10 border-accent/20">
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-accent/20 p-1.5 shrink-0">
                          <Lightbulb size={14} className="text-accent" />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <div className="flex items-center gap-1.5">
                            <Download size={12} className="text-accent" />
                            <Upload size={12} className="text-accent" />
                            <h4 className="font-semibold text-xs">Exportar/Importar</h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Exporta tus datos regularmente para acceder desde cualquier dispositivo.
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Consejo sobre prompt para importar */}
                    <Card className="p-3 bg-secondary/10 border-secondary/20 cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => setPromptDialogOpen(true)}>
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-secondary/20 p-1.5 shrink-0">
                          <FileText size={14} className="text-secondary-foreground" />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <div className="flex items-center gap-1.5">
                            <FileText size={12} className="text-secondary-foreground" />
                            <h4 className="font-semibold text-xs">Prompt para Importar</h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Usa el siguiente prompt para crear un archivo importable de forma sencilla.
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Consejo sobre GitHub */}
                    <Card className="p-3 bg-primary/10 border-primary/20">
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/20 p-1.5 shrink-0">
                          <GithubLogo size={14} className="text-primary" />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <div className="flex items-center gap-1.5">
                            <Star size={12} className="text-primary" />
                            <h4 className="font-semibold text-xs">¿Te gusta la app?</h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Dale una estrella al repositorio y deja un issue si tienes problemas.
                          </p>
                          <a
                            href="https://github.com/Jrgil20/gapto10-cfpp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline mt-1 flex items-center gap-1 w-fit"
                          >
                            <GithubLogo size={12} />
                            Ver en GitHub
                          </a>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="icon" onClick={() => setConfigDialogOpen(true)} className="h-9 w-9 sm:h-10 sm:w-10">
              <GearSix size={18} className="sm:hidden" />
              <GearSix size={20} className="hidden sm:block" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 flex-1">
        {view === 'dashboard' ? (
          <Dashboard
            subjects={subjectsData}
            config={configData}
            onSelectSubject={handleSelectSubject}
            onAddSubject={() => setSubjectDialogOpen(true)}
          />
        ) : selectedSubject && calculation && configData ? (
          <SubjectView
            subject={selectedSubject}
            calculation={calculation}
            config={configData}
            onAddEvaluation={() => {
              setEditingEvaluation(undefined)
              setEvaluationDialogOpen(true)
            }}
            onEditEvaluation={handleEditEvaluation}
            onDeleteEvaluation={handleDeleteEvaluation}
            onUpdateNote={handleUpdateNote}
            calculationMode={calculationMode}
            onCalculationModeChange={setCalculationMode}
          />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-auto">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-start">
              <span>Por</span>
              <a 
                href="https://github.com/Jrgil20" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Jrgil20
              </a>
              <span className="hidden sm:inline">con asistencia de</span>
              <span className="sm:hidden">+</span>
              <span className="font-semibold text-accent">Claude AI</span>
              <span className="text-xs opacity-70 hidden sm:inline">• concebido con GitHub Spark</span>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href="https://github.com/Jrgil20/gapto10-cfpp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="hidden sm:inline">Ver código</span>
                <span className="sm:hidden">GitHub</span>
              </a>
              <span>•</span>
              <span>2025</span>
            </div>
          </div>
        </div>
      </footer>

      <SubjectDialog
        open={subjectDialogOpen}
        onOpenChange={setSubjectDialogOpen}
        onSave={handleSaveSubject}
      />

      {selectedSubject && configData && (
        <EvaluationDialog
          open={evaluationDialogOpen}
          onOpenChange={(open) => {
            setEvaluationDialogOpen(open)
            if (!open) {
              setEditingEvaluation(undefined)
            }
          }}
          onSave={handleSaveEvaluation}
          onSaveMultiple={handleSaveMultipleEvaluations}
          subject={selectedSubject}
          evaluation={editingEvaluation}
          defaultMaxPoints={configData.defaultMaxPoints}
        />
      )}

      {configData && (
        <ConfigDialog
          open={configDialogOpen}
          onOpenChange={setConfigDialogOpen}
          config={configData}
          onSave={(newConfig) => setConfig(newConfig)}
        />
      )}

      <ExportImportDialog
        open={exportImportDialogOpen}
        onOpenChange={(open) => {
          setExportImportDialogOpen(open)
          if (!open) {
            setImportData(undefined)
          }
        }}
        mode={exportImportMode}
        subjects={exportImportMode === 'export' ? subjectsData : undefined}
        config={exportImportMode === 'export' ? configData : undefined}
        importData={exportImportMode === 'import' ? importData : undefined}
        onConfirm={exportImportMode === 'export' ? handleConfirmExport : handleConfirmImport}
        showJson={configData?.showJsonInExportImport ?? false}
      />

      <WelcomeDialog
        open={welcomeDialogOpen}
        onOpenChange={setWelcomeDialogOpen}
        onAccept={handleAcceptWelcome}
      />

      {/* Diálogo del Prompt */}
      <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[85vh] sm:max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileText size={18} className="text-primary shrink-0 sm:hidden" />
              <FileText size={20} className="text-primary shrink-0 hidden sm:block" />
              <span className="truncate">Prompt para Materias JSON</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Copia este prompt y úsalo con un asistente de IA para generar archivos JSON.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[55vh] sm:max-h-[60vh] pr-2 sm:pr-4">
            <pre className="text-[10px] sm:text-xs bg-muted p-2 sm:p-4 rounded-lg whitespace-pre-wrap font-mono overflow-x-auto">
              {promptText}
            </pre>
          </ScrollArea>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setPromptDialogOpen(false)} className="w-full sm:w-auto">
              Cerrar
            </Button>
            <Button onClick={handleCopyPrompt} className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <Copy size={16} />
              Copiar Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App