# Frontend - Sistema de Gestión de Restaurante

Este es el frontend del sistema de gestión de restaurante desarrollado con React, Material-UI y Vite.

## Características

- **Dashboard** con estadísticas en tiempo real
- **Gestión de Clientes** - CRUD completo
- **Gestión del Menú** - Vista de tabla y cuadrícula
- **Gestión de Reservaciones** - Con fechas y relaciones
- **Gestión de Pedidos** - Con relaciones a reservaciones y menú
- **Gestión de Mesas** - CRUD completo
- **Gestión de Empleados** - Con roles predefinidos
- **Gestión de Turnos** - Con relaciones a empleados y mesas

## Tecnologías Utilizadas

- React 18
- Material-UI (MUI)
- React Router DOM
- Axios para API calls
- Vite como bundler

## Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Pasos para ejecutar

1. **Navegar al directorio del frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   El frontend estará disponible en `http://localhost:5173`

## Configuración de la API

El frontend está configurado para conectarse a la API en `https://localhost:7001/api`. 

Si tu backend está ejecutándose en un puerto diferente, modifica la URL en:
```
frontend/src/services/api.js
```

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   └── Layout/
│   │       └── AppLayout.jsx
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Clientes/
│   │   ├── Menu/
│   │   ├── Reservaciones/
│   │   ├── Pedidos/
│   │   ├── Mesas/
│   │   ├── Empleados/
│   │   └── Turnos/
│   ├── services/
│   │   ├── api.js
│   │   ├── clientesService.js
│   │   ├── menusService.js
│   │   ├── reservacionesService.js
│   │   ├── pedidosService.js
│   │   ├── mesasService.js
│   │   ├── empleadosService.js
│   │   └── turnosService.js
│   ├── App.jsx
│   └── main.jsx
```

## Funcionalidades

### Dashboard
- Estadísticas en tiempo real de todas las entidades
- Tarjetas informativas con iconos
- Diseño responsive

### Gestión de Entidades
- **Tablas** con paginación y ordenamiento
- **Formularios** modales para crear/editar
- **Validación** de campos requeridos
- **Notificaciones** de éxito/error
- **Confirmaciones** para eliminaciones

### Características Especiales
- **Vista de cuadrícula** para el menú
- **Relaciones** entre entidades (clientes-mesas, empleados-turnos, etc.)
- **Fechas y horas** con controles nativos
- **Roles predefinidos** para empleados
- **Diseño responsive** para móviles y tablets

## Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la construcción
npm run preview

# Linting
npm run lint
```

## Notas Importantes

1. **Backend requerido**: Asegúrate de que tu backend esté ejecutándose antes de usar el frontend.

2. **CORS**: El backend debe tener CORS configurado para permitir peticiones desde `http://localhost:5173`.

3. **Puerto de la API**: Si tu backend usa un puerto diferente a 7001, actualiza la configuración en `src/services/api.js`.

4. **Base de datos**: Asegúrate de que tu base de datos esté configurada y tenga datos de ejemplo para probar las funcionalidades.

## Solución de Problemas

### Error de conexión a la API
- Verifica que el backend esté ejecutándose
- Confirma la URL en `src/services/api.js`
- Revisa la configuración de CORS en el backend

### Errores de dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problemas de puerto
Si el puerto 5173 está ocupado, Vite automáticamente usará el siguiente puerto disponible.
