# Guía de Implementación de Componentes - Foliador PDF

## 📁 Estructura de Carpetas

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── MainLayout.tsx
│   │   └── ConfigurationLayout.tsx
│   ├── file-upload/
│   │   ├── FileUploadSection.tsx
│   │   └── FileUploadInput.tsx
│   ├── configuration/
│   │   ├── ConfigurationPanel.tsx
│   │   ├── PositionConfig.tsx
│   │   ├── AppearanceConfig.tsx
│   │   └── NumberingConfig.tsx
│   ├── preview/
│   │   ├── PdfPreview.tsx
│   │   └── FolioPreview.tsx
│   ├── actions/
│   │   ├── ActionButtons.tsx
│   │   ├── ProcessButton.tsx
│   │   └── DownloadButton.tsx
│   ├── feedback/
│   │   ├── ProgressIndicator.tsx
│   │   ├── ErrorDisplay.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── StatusIndicator.tsx
│   └── ui/ (shadcn components ya existentes)
```

## 🎯 Componentes Principales

### 1. **AppLayout.tsx** (Componente raíz)

**Ubicación**: `src/components/layout/AppLayout.tsx`

**Responsabilidades**:

- [ ] Renderizar el layout principal basado en el estado de la máquina
- [ ] Manejar transiciones entre estados principales
- [ ] Mostrar/ocultar secciones según el estado actual
- [ ] Integrar todos los componentes hijos

**Estados que maneja**:

- `idle` → Mostrar FileUploadSection
- `uploading` → Mostrar FileUploadSection con loading
- `configuring` → Mostrar MainLayout con ConfigurationPanel
- `ready` → Mostrar MainLayout con botones habilitados
- `processing` → Mostrar MainLayout con progreso
- `completed` → Mostrar MainLayout con botón de descarga
- `error` → Mostrar ErrorDisplay

**Props**:

```typescript
interface AppLayoutProps {
  actor: ActorRefFrom<typeof pdfFolioOrchestrator>
}
```

### 2. **FileUploadSection.tsx**

**Ubicación**: `src/components/file-upload/FileUploadSection.tsx`

**Responsabilidades**:

- [ ] Mostrar input de archivo grande y prominente
- [ ] Manejar drag & drop de archivos
- [ ] Validar tipo de archivo (solo PDF)
- [ ] Mostrar estado de carga durante upload
- [ ] Mostrar errores de validación
- [ ] Enviar evento `fileManager.UPLOAD_FILE` al store

**Estados que maneja**:

- Estado inicial (sin archivo)
- Estado de carga (archivo siendo procesado)
- Estado de error (archivo inválido)

**Características**:

- Input visualmente prominente
- Soporte para drag & drop
- Validación en tiempo real
- Feedback visual inmediato

### 3. **MainLayout.tsx**

**Ubicación**: `src/components/layout/MainLayout.tsx`

**Responsabilidades**:

- [ ] Layout de 2 columnas (configuración + preview)
- [ ] Manejar responsive design
- [ ] Contener ConfigurationPanel y PdfPreview
- [ ] Mostrar ActionButtons en la parte inferior

**Layout**:

```
┌─────────────────────────────────────────────────────────┐
│                    Header/Navigation                     │
├─────────────────────┬───────────────────────────────────┤
│                     │                                   │
│  ConfigurationPanel │         PdfPreview                │
│  (scrolleable)      │         (altura completa)         │
│                     │                                   │
│                     │                                   │
├─────────────────────┼───────────────────────────────────┤
│    ActionButtons    │                                   │
└─────────────────────┴───────────────────────────────────┘
```

### 4. **ConfigurationPanel.tsx**

**Ubicación**: `src/components/configuration/ConfigurationPanel.tsx`

**Responsabilidades**:

- [ ] Contenedor scrolleable para todas las configuraciones
- [ ] Organizar secciones de configuración
- [ ] Mostrar StatusIndicator del estado actual
- [ ] Contener PositionConfig, AppearanceConfig, NumberingConfig
- [ ] Mostrar ActionButtons en la parte inferior

**Características**:

- Scroll vertical cuando el contenido excede la altura
- Ancho fijo (aproximadamente 400px)
- Padding y espaciado consistente
- Secciones claramente separadas

### 5. **PositionConfig.tsx**

**Ubicación**: `src/components/configuration/PositionConfig.tsx`

**Responsabilidades**:

- [ ] Configurar esquina vertical (top/bottom)
- [ ] Configurar esquina horizontal (left/right)
- [ ] Ajustar posición X/Y (en centímetros)
- [ ] Configurar rotación (grados)
- [ ] Configurar aleatoriedad X/Y/Rotación
- [ ] Enviar eventos `configManager.UPDATE_CONFIG` con sección position

**Controles**:

- Radio buttons para esquinas
- Sliders para posición y rotación
- Inputs numéricos para valores exactos
- Toggles para habilitar/deshabilitar aleatoriedad

### 6. **AppearanceConfig.tsx**

**Ubicación**: `src/components/configuration/AppearanceConfig.tsx`

**Responsabilidades**:

- [ ] Selector de color para el folio
- [ ] Slider de transparencia (0-100%)
- [ ] Input de tamaño de fuente
- [ ] Preview del color seleccionado
- [ ] Enviar eventos `configManager.UPDATE_CONFIG` con sección appearance

**Controles**:

- Color picker
- Slider con valor numérico
- Input numérico para tamaño de fuente
- Preview en tiempo real

### 7. **NumberingConfig.tsx**

**Ubicación**: `src/components/configuration/NumberingConfig.tsx`

**Responsabilidades**:

- [ ] Configurar número inicial
- [ ] Seleccionar dirección (first/last)
- [ ] Seleccionar tipo (numbers/letters/mixed)
- [ ] Configurar padding de ceros
- [ ] Enviar eventos `configManager.UPDATE_CONFIG` con sección numbering

**Controles**:

- Input numérico para número inicial
- Radio buttons para dirección
- Select para tipo de numeración
- Input numérico para padding

### 8. **PdfPreview.tsx**

**Ubicación**: `src/components/preview/PdfPreview.tsx`

**Responsabilidades**:

- [ ] Mostrar preview del PDF actual
- [ ] Mostrar FolioPreview superpuesto
- [ ] Actualizar preview en tiempo real con cambios de configuración
- [ ] Manejar zoom y navegación del PDF
- [ ] Mostrar estado de carga del PDF

**Características**:

- Altura completa disponible
- Zoom in/out
- Navegación entre páginas
- Preview del folio en tiempo real
- Responsive al tamaño del contenedor

### 9. **FolioPreview.tsx**

**Ubicación**: `src/components/preview/FolioPreview.tsx`

**Responsabilidades**:

- [ ] Mostrar preview visual del folio según configuración
- [ ] Actualizar posición en tiempo real
- [ ] Mostrar texto del folio (número/letra)
- [ ] Aplicar color y transparencia
- [ ] Mostrar rotación

**Características**:

- Overlay sobre el PDF
- Actualización en tiempo real
- Preview del texto real del folio
- Indicadores visuales de posición

### 10. **ActionButtons.tsx**

**Ubicación**: `src/components/actions/ActionButtons.tsx`

**Responsabilidades**:

- [ ] Mostrar botón "Procesar" cuando esté listo
- [ ] Mostrar botón "Descargar" cuando esté completado
- [ ] Mostrar botón "Cancelar" durante procesamiento
- [ ] Mostrar botón "Nuevo archivo" después de completar
- [ ] Mostrar botón "Reintentar" en caso de error
- [ ] Manejar estados disabled/enabled según contexto

**Estados de botones**:

- **Procesar**: Habilitado en `ready`, disabled en otros estados
- **Descargar**: Solo visible en `completed`
- **Cancelar**: Solo visible en `processing`
- **Nuevo archivo**: Visible en `completed`, envía `RESTART_AFTER_COMPLETE`
- **Reintentar**: Visible en `error`, envía `CLEAR_ERROR`

### 11. **ProgressIndicator.tsx**

**Ubicación**: `src/components/feedback/ProgressIndicator.tsx`

**Responsabilidades**:

- [ ] Mostrar barra de progreso durante procesamiento
- [ ] Mostrar porcentaje de progreso
- [ ] Mostrar texto descriptivo del paso actual
- [ ] Animación suave de progreso

**Características**:

- Barra de progreso visual
- Porcentaje numérico
- Texto descriptivo
- Animaciones CSS

### 12. **ErrorDisplay.tsx**

**Ubicación**: `src/components/feedback/ErrorDisplay.tsx`

**Responsabilidades**:

- [ ] Mostrar mensajes de error de forma prominente
- [ ] Categorizar tipos de error (validación, procesamiento, etc.)
- [ ] Mostrar botón "Reintentar" o "Limpiar error"
- [ ] Mostrar detalles técnicos del error (opcional)

**Tipos de error**:

- Error de validación de archivo
- Error de procesamiento
- Error de configuración
- Error general

### 13. **LoadingSpinner.tsx**

**Ubicación**: `src/components/feedback/LoadingSpinner.tsx`

**Responsabilidades**:

- [ ] Mostrar spinner durante operaciones asíncronas
- [ ] Texto descriptivo de la operación
- [ ] Tamaños diferentes (small, medium, large)

### 14. **StatusIndicator.tsx**

**Ubicación**: `src/components/feedback/StatusIndicator.tsx`

**Responsabilidades**:

- [ ] Mostrar estado actual del sistema
- [ ] Iconos visuales para cada estado
- [ ] Texto descriptivo del estado
- [ ] Colores diferenciados por estado

**Estados**:

- ⏳ Subiendo archivo
- ⚙️ Configurando
- ✅ Listo para procesar
- 🔄 Procesando
- ✅ Completado
- ❌ Error

## 🔄 Estados de Transición

### **Loading States**:

- [ ] Spinner durante upload de archivo
- [ ] Spinner durante carga del PDF
- [ ] Spinner durante procesamiento
- [ ] Skeleton loading para preview

### **Disabled States**:

- [ ] Controles de configuración durante procesamiento
- [ ] Botón de procesar cuando no hay archivo/configuración
- [ ] Botón de descarga cuando no hay PDF procesado

### **Error States**:

- [ ] Error de validación de archivo
- [ ] Error de procesamiento
- [ ] Error de configuración
- [ ] Error de red/desconocido

## 🧭 Navegación

### **Botones de Navegación**:

- [ ] "Nuevo archivo" (completed → idle)
- [ ] "Atrás" (processing → ready)
- [ ] "Reintentar" (error → ready)
- [ ] "Limpiar error" (error → ready)

### **Flujo de Navegación**:

```
idle → uploading → configuring → ready → processing → completed
  ↑                                                      ↓
  ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

## 🎨 Consideraciones de UI/UX

### **Responsive Design**:

- [ ] Layout de 2 columnas en desktop
- [ ] Layout de 1 columna en mobile (stack vertical)
- [ ] Preview responsive
- [ ] Controles adaptables

### **Feedback Visual**:

- [ ] Hover states en todos los controles
- [ ] Focus states para accesibilidad básica
- [ ] Transiciones suaves entre estados
- [ ] Animaciones de carga

### **Consistencia**:

- [ ] Usar componentes shadcn/ui existentes
- [ ] Paleta de colores consistente
- [ ] Espaciado y tipografía uniformes
- [ ] Iconografía coherente

## 📋 Checklist de Implementación

### **Fase 1: Estructura Base**

- [x] Crear estructura de carpetas
- [x] Implementar AppLayout.tsx
- [x] Implementar MainLayout.tsx
- [x] Implementar FileUploadSection.tsx

### **Fase 2: Configuración**

- [x] Implementar ConfigurationPanel.tsx
- [x] Implementar PositionConfig.tsx
- [x] Implementar AppearanceConfig.tsx
- [x] Implementar NumberingConfig.tsx

### **Fase 3: Preview**

- [x] Implementar PdfPreview.tsx
- [x] Implementar FolioPreview.tsx

### **Fase 4: Acciones y Feedback**

- [x] Implementar ActionButtons.tsx
- [x] Implementar ProgressIndicator.tsx
- [x] Implementar ErrorDisplay.tsx
- [x] Implementar LoadingSpinner.tsx
- [x] Implementar StatusIndicator.tsx

### **Fase 5: Integración**

- [x] Conectar todos los componentes con el store
- [x] Probar todos los flujos de estado
- [x] Ajustar responsive design
- [x] Optimizar performance

## 🚀 Orden de Implementación Recomendado

1. **AppLayout** (estructura base)
2. **FileUploadSection** (primer flujo)
3. **MainLayout** (layout principal)
4. **ConfigurationPanel** (contenedor)
5. **PositionConfig** (primer grupo de controles)
6. **PdfPreview** (preview básico)
7. **ActionButtons** (acciones principales)
8. **ProgressIndicator** (feedback de procesamiento)
9. **AppearanceConfig** y **NumberingConfig** (resto de controles)
10. **FolioPreview** (preview avanzado)
11. **ErrorDisplay** y **StatusIndicator** (feedback completo)
12. **LoadingSpinner** (estados de carga)

Esta guía servirá como referencia completa durante toda la implementación de la UI.
