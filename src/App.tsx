import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Subject, Evaluation, Config, CalculationMode } from './types'
import { SubjectDialog } from './components/SubjectDialog'
import { EvaluationDialog } from './components/EvaluationDialog'
import { SubjectView } from './components/SubjectView'
import { ConfigDialog } from './components/ConfigDialog'
import { Dashboard } from './components/Dashboard'
import { Button } from './components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet'
import { Card } from './components/ui/card'
import { Separator } from './components/ui/separator'
import { toast } from 'sonner'
import { List, Plus, GearSix, Download, Upload, Trash, House, ArrowLeft } from '@phosphor-icons/react'
import { calculateRequiredNotes } from './lib/calculations'

function App() {
  const [subjects, setSubjects] = useKV<Subject[]>('gapto10-subjects', [])
  const [config, setConfig] = useKV<Config>('gapto10-config', {
    defaultMaxPoints: 20,
    percentagePerPoint: 5,
    passingPercentage: 50
  })

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false)
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false)
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | undefined>(undefined)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('pessimistic')
  const [view, setView] = useState<'dashboard' | 'subject'>('dashboard')

  const subjectsData = subjects || []
  const configData = config || {
    defaultMaxPoints: 20,
    percentagePerPoint: 5,
    passingPercentage: 50
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

  const handleExport = () => {
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
          
          if (data.subjects && Array.isArray(data.subjects)) {
            setSubjects(data.subjects)
          }
          if (data.config) {
            setConfig(data.config)
          }
          
          toast.success('Datos importados correctamente')
        } catch (error) {
          toast.error('Error al importar: archivo inválido')
        }
      }
      reader.readAsText(file)
    }
    
    input.click()
  }

  const calculation = selectedSubject && configData
    ? calculateRequiredNotes(selectedSubject, configData)
    : null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <List size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Materias</SheetTitle>
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
              <Button variant="ghost" size="icon" onClick={handleBackToDashboard}>
                <ArrowLeft size={20} className="text-primary" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={handleBackToDashboard}>
                <House size={20} weight="fill" className="text-accent" />
              </Button>
            )}

            {view === 'subject' && selectedSubject ? (
              <h1 className="text-xl font-bold">{selectedSubject.name}</h1>
            ) : (
              <div className="flex flex-col">
                <h1 className="text-xl font-bold leading-tight">
                  {['G', 'a', 'p', 'T', 'o', '1', '0'].map((char, i) => (
                    <span key={i} className="text-foreground">
                      {char}
                    </span>
                  ))}
                  <span className="text-base ml-2">
                    {' - Cuánto Falta Para Pasar'.split('').map((char, i) => (
                      <span key={i} className={/[A-ZÁÉÍÓÚÑ]/.test(char) ? 'text-primary' : 'text-muted-foreground'}>
                        {char}
                      </span>
                    ))}
                  </span>
                </h1>
                <p className="text-xs">
                  {'Gestor de Notas Académicas'.split('').map((char, i) => (
                    <span key={i} className={/[A-ZÁÉÍÓÚÑ]/.test(char) ? 'text-primary' : 'text-muted-foreground'}>
                      {char}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>

          <Button variant="outline" size="icon" onClick={() => setConfigDialogOpen(true)}>
            <GearSix size={20} />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
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
            onUpdateNote={handleUpdateNote}
            calculationMode={calculationMode}
            onCalculationModeChange={setCalculationMode}
          />
        ) : null}
      </main>

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
    </div>
  )
}

export default App