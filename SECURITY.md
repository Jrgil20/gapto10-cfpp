# Política de Seguridad

Gracias por ayudar a mantener GapTo10 seguro para todos.

## Reportar Vulnerabilidades de Seguridad

Si crees que has encontrado una vulnerabilidad de seguridad en este proyecto, por favor repórtala a través de una divulgación coordinada.

**Por favor NO reportes vulnerabilidades de seguridad a través de issues públicos de GitHub, discusiones o pull requests.**

En su lugar, por favor envía un email a [Jrgil20](https://github.com/Jrgil20) o crea un [Security Advisory](https://github.com/Jrgil20/gapto10-cfpp/security/advisories/new) privado en GitHub.

Por favor incluye tanta información como sea posible de la lista siguiente para ayudarnos a entender y resolver el problema más rápidamente:

  * El tipo de problema (ej: XSS, inyección de código, exposición de datos)
  * Rutas completas de los archivos fuente relacionados con la manifestación del problema
  * La ubicación del código fuente afectado (tag/branch/commit o URL directa)
  * Cualquier configuración especial requerida para reproducir el problema
  * Instrucciones paso a paso para reproducir el problema
  * Código de prueba de concepto o exploit (si es posible)
  * Impacto del problema, incluyendo cómo un atacante podría explotar el problema

Esta información nos ayudará a priorizar tu reporte más rápidamente.

## Alcance

Esta aplicación es una aplicación web estática que se ejecuta completamente en el cliente. Los datos se almacenan localmente en el navegador del usuario usando localStorage. No hay servidor backend ni comunicación con servicios externos.

Las vulnerabilidades que serían relevantes incluyen:

- Vulnerabilidades de XSS (Cross-Site Scripting)
- Problemas de almacenamiento local inseguro
- Problemas de importación/exportación de datos
- Vulnerabilidades en dependencias de terceros

## Política

Seguimos el principio de divulgación responsable. Si reportas una vulnerabilidad de manera responsable, trabajaremos contigo para resolverla antes de hacerla pública.

## Reconocimientos

Agradecemos a todos los que reportan vulnerabilidades de manera responsable. Tu ayuda hace que esta aplicación sea más segura para todos los usuarios.
