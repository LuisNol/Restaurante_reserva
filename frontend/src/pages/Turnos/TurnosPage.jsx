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
import { turnosService } from '../../services/turnosService';
import { empleadosService } from '../../services/empleadosService';
import { mesasService } from '../../services/mesasService';

function TurnosPage() {
  const [turnos, setTurnos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTurno, setEditingTurno] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    empleadoId: '',
    mesaId: '',
    fechaTurno: '',
    horaTurno: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [turnosData, empleadosData, mesasData] = await Promise.all([
        turnosService.getTurnos(),
        empleadosService.getEmpleados(),
        mesasService.getMesas(),
      ]);
      setTurnos(turnosData.datos || []);
      setEmpleados(empleadosData.datos || []);
      setMesas(mesasData.datos || []);
    } catch (error) {
      showSnackbar('Error al cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (turno = null) => {
    if (turno) {
      setEditingTurno(turno);
      setFormData({
        empleadoId: turno.empleadoId.toString(),
        mesaId: turno.mesaId.toString(),
        fechaTurno: turno.fechaTurno,
        horaTurno: turno.horaTurno,
      });
    } else {
      setEditingTurno(null);
      setFormData({
        empleadoId: '',
        mesaId: '',
        fechaTurno: '',
        horaTurno: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTurno(null);
    setFormData({
      empleadoId: '',
      mesaId: '',
      fechaTurno: '',
      horaTurno: '',
    });
  };

  const handleSubmit = async () => {
    try {
      const turnoData = {
        ...formData,
        empleadoId: parseInt(formData.empleadoId),
        mesaId: parseInt(formData.mesaId),
      };

      if (editingTurno) {
        await turnosService.actualizarTurno(editingTurno.id, turnoData);
        showSnackbar('Turno actualizado exitosamente', 'success');
      } else {
        await turnosService.crearTurno(turnoData);
        showSnackbar('Turno creado exitosamente', 'success');
      }
      handleCloseDialog();
      fetchData();
    } catch (error) {
      showSnackbar('Error al guardar el turno', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este turno?')) {
      try {
        await turnosService.eliminarTurno(id);
        showSnackbar('Turno eliminado exitosamente', 'success');
        fetchData();
      } catch (error) {
        showSnackbar('Error al eliminar el turno', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getEmpleadoName = (empleadoId) => {
    const empleado = empleados.find(e => e.id === empleadoId);
    return empleado ? `${empleado.nombre} ${empleado.apellido}` : 'N/A';
  };

  const getMesaNumber = (mesaId) => {
    const mesa = mesas.find(m => m.id === mesaId);
    return mesa ? mesa.numeroMesa : 'N/A';
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
        <Typography variant="h4">Gestión de Turnos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Turno
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Mesa</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turnos.map((turno) => (
              <TableRow key={turno.id}>
                <TableCell>{turno.id}</TableCell>
                <TableCell>{getEmpleadoName(turno.empleadoId)}</TableCell>
                <TableCell>Mesa {getMesaNumber(turno.mesaId)}</TableCell>
                <TableCell>{turno.fechaTurno}</TableCell>
                <TableCell>{turno.horaTurno}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(turno)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(turno.id)}
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
          {editingTurno ? 'Editar Turno' : 'Nuevo Turno'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Empleado</InputLabel>
              <Select
                value={formData.empleadoId}
                onChange={(e) => setFormData({ ...formData, empleadoId: e.target.value })}
                label="Empleado"
              >
                {empleados.map((empleado) => (
                  <MenuItem key={empleado.id} value={empleado.id.toString()}>
                    {empleado.nombre} {empleado.apellido} - {empleado.rol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Mesa</InputLabel>
              <Select
                value={formData.mesaId}
                onChange={(e) => setFormData({ ...formData, mesaId: e.target.value })}
                label="Mesa"
              >
                {mesas.map((mesa) => (
                  <MenuItem key={mesa.id} value={mesa.id.toString()}>
                    Mesa {mesa.numeroMesa} (Capacidad: {mesa.capacidad})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Fecha del Turno"
              type="date"
              value={formData.fechaTurno}
              onChange={(e) => setFormData({ ...formData, fechaTurno: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Hora del Turno"
              type="time"
              value={formData.horaTurno}
              onChange={(e) => setFormData({ ...formData, horaTurno: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTurno ? 'Actualizar' : 'Crear'}
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

export default TurnosPage; 