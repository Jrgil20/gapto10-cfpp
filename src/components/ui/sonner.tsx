import { CSSProperties } from "react"
import { Toaster as Sonner, ToasterProps } from "sonner"

/**
 * Componente Toaster simplificado para notificaciones.
 * Usa tema oscuro por defecto para coincidir con el diseño de la app.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
