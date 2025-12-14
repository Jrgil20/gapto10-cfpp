import { useState, useEffect, useCallback } from 'react'
import { Subject } from '../types'

/**
 * Hook para manejar el orden personalizado de las materias.
 * Persiste el orden en localStorage y permite reordenar mediante drag-and-drop.
 */
export function useSubjectOrder(subjects: Subject[]) {
  const [order, setOrder] = useState<string[]>(() => {
    // Obtener orden guardado o usar orden por defecto (por ID)
    if (typeof window === 'undefined') return []
    
    try {
      const stored = window.localStorage.getItem('gapto10-subjects-order')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Error reading subjects order:', error)
    }
    
    return []
  })

  // Sincronizar orden cuando cambian las materias (nuevas materias al final)
  useEffect(() => {
    const subjectIds = subjects.map(s => s.id)
    const currentOrder = order.filter(id => subjectIds.includes(id))
    const newSubjects = subjectIds.filter(id => !order.includes(id))
    
    if (newSubjects.length > 0 || currentOrder.length !== subjectIds.length) {
      const newOrder = [...currentOrder, ...newSubjects]
      setOrder(newOrder)
      
      try {
        window.localStorage.setItem('gapto10-subjects-order', JSON.stringify(newOrder))
      } catch (error) {
        console.warn('Error saving subjects order:', error)
      }
    }
  }, [subjects, order])

  // Reordenar materias
  const reorderSubjects = useCallback((newOrder: string[]) => {
    setOrder(newOrder)
    try {
      window.localStorage.setItem('gapto10-subjects-order', JSON.stringify(newOrder))
    } catch (error) {
      console.warn('Error saving subjects order:', error)
    }
  }, [])

  // Obtener materias ordenadas según el orden guardado
  const getOrderedSubjects = useCallback((): Subject[] => {
    const subjectMap = new Map(subjects.map(s => [s.id, s]))
    const ordered: Subject[] = []
    
    // Primero agregar materias en el orden guardado
    for (const id of order) {
      const subject = subjectMap.get(id)
      if (subject) {
        ordered.push(subject)
        subjectMap.delete(id)
      }
    }
    
    // Agregar cualquier materia nueva que no esté en el orden
    for (const subject of subjectMap.values()) {
      ordered.push(subject)
    }
    
    return ordered
  }, [subjects, order])

  return {
    order,
    reorderSubjects,
    getOrderedSubjects
  }
}
