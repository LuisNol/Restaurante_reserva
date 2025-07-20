import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { pedidosService } from '../../services/pedidosService';
import { reservacionesService } from '../../services/reservacionesService';
import { menusService } from '../../services/menusService';

function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [reservaciones, setReservaciones] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPedido, setEditingPedido] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    reservacionId: '',
    menuId: '',
    cantidad: '',
    horaPedido: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pedidosData, reservacionesData, menusData] = await Promise.all([
        pedidosService.getPedidos(),
        reservacionesService.getReservaciones(),
        menusService.getMenus(),
      ]);
      setPedidos(pedidosData.datos || []);
      setReservaciones(reservacionesData.datos || []);
      setMenus(menusData.datos || []);
    } catch (error) {
      showSnackbar('Error al cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (pedido = null) => {
    if (pedido) {
      setEditingPedido(pedido);
      // Convertir la hora ISO a formato HH:MM para el formulario
      let horaFormateada = '';
      if (pedido.horaPedido) {
        if (pedido.horaPedido.includes('T')) {
          // Formato ISO: "2025-07-20T00:14:36.2688502+00:00"
          const fecha = new Date(pedido.horaPedido);
          horaFormateada = fecha.toTimeString().slice(0, 5);
        } else {
          // Formato simple: "19:19"
          horaFormateada = pedido.horaPedido;
        }
      }
      
      setFormData({
        reservacionId: pedido.reservacionId.toString(),
        menuId: pedido.menuId.toString(),
        cantidad: pedido.cantidad.toString(),
        horaPedido: horaFormateada,
      });
    } else {
      setEditingPedido(null);
      // Generar hora actual automáticamente para nuevos pedidos
      const currentTime = getCurrentTime();
      setFormData({
        reservacionId: '',
        menuId: '',
        cantidad: '',
        horaPedido: currentTime,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPedido(null);
    setFormData({
      reservacionId: '',
      menuId: '',
      cantidad: '',
      horaPedido: '',
    });
  };

  const handleSubmit = async () => {
    try {
      // Validar que todos los campos requeridos estén presentes
      if (!formData.reservacionId || !formData.menuId || !formData.cantidad) {
        showSnackbar('Por favor, complete todos los campos requeridos', 'error');
        return;
      }

      const pedidoData = {
        reservacionId: parseInt(formData.reservacionId),
        menuId: parseInt(formData.menuId),
        cantidad: parseInt(formData.cantidad),
        // Para nuevos pedidos, no enviar horaPedido (el backend la generará)
        ...(editingPedido && { horaPedido: formData.horaPedido })
      };

      console.log('Datos a enviar:', pedidoData);

      if (editingPedido) {
        await pedidosService.actualizarPedido(editingPedido.id, pedidoData);
        showSnackbar('Pedido actualizado exitosamente', 'success');
      } else {
        await pedidosService.crearPedido(pedidoData);
        showSnackbar('Pedido creado exitosamente', 'success');
      }
      handleCloseDialog();
      fetchData();
    } catch (error) {
      console.error('Error al guardar pedido:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      let errorMessage = 'Error al guardar el pedido';
      
      if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.title) {
        errorMessage = error.response.data.title;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      try {
        await pedidosService.eliminarPedido(id);
        showSnackbar('Pedido eliminado exitosamente', 'success');
        fetchData();
      } catch (error) {
        showSnackbar('Error al eliminar el pedido', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getReservacionInfo = (reservacionId) => {
    const reservacion = reservaciones.find(r => r.id === reservacionId);
    return reservacion ? `Reservación #${reservacion.id}` : 'N/A';
  };

  const getMenuName = (menuId) => {
    const menu = menus.find(m => m.id === menuId);
    return menu ? menu.nombre : 'N/A';
  };

  // Función para generar la hora actual en formato HH:MM
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Función para formatear la hora para mostrar en la tabla
  const formatHoraPedido = (horaPedido) => {
    if (!horaPedido) return 'N/A';
    
    if (horaPedido.includes('T')) {
      // Formato ISO: "2025-07-20T00:14:36.2688502+00:00"
      const fecha = new Date(horaPedido);
      return fecha.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      // Formato simple: "19:19"
      return horaPedido;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestión de Pedidos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Pedido
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Reservación</TableCell>
              <TableCell>Elemento del Menú</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Hora del Pedido</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id}</TableCell>
                <TableCell>{getReservacionInfo(pedido.reservacionId)}</TableCell>
                <TableCell>{getMenuName(pedido.menuId)}</TableCell>
                <TableCell>{pedido.cantidad}</TableCell>
                <TableCell>{formatHoraPedido(pedido.horaPedido)}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(pedido)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(pedido.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPedido ? 'Editar Pedido' : 'Nuevo Pedido'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Reservación</InputLabel>
              <Select
                value={formData.reservacionId}
                onChange={(e) => setFormData({ ...formData, reservacionId: e.target.value })}
                label="Reservación"
              >
                {reservaciones.map((reservacion) => (
                  <MenuItem key={reservacion.id} value={reservacion.id.toString()}>
                    Reservación #{reservacion.id} - {reservacion.fechaReservacion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Elemento del Menú</InputLabel>
              <Select
                value={formData.menuId}
                onChange={(e) => setFormData({ ...formData, menuId: e.target.value })}
                label="Elemento del Menú"
              >
                {menus.map((menu) => (
                  <MenuItem key={menu.id} value={menu.id.toString()}>
                    {menu.nombre} - ${menu.precio}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Cantidad"
              type="number"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />

            <TextField
              fullWidth
              label="Hora del Pedido"
              type="time"
              value={formData.horaPedido}
              onChange={(e) => setFormData({ ...formData, horaPedido: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              helperText={editingPedido ? "Puedes modificar la hora del pedido" : "Hora automática del momento de creación"}
              disabled={!editingPedido} // Solo editable al editar, no al crear
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPedido ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PedidosPage; 