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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { mesasService } from '../../services/mesasService';

function MesasPage() {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMesa, setEditingMesa] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    numeroMesa: '',
    capacidad: '',
  });

  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    try {
      setLoading(true);
      const response = await mesasService.getMesas();
      setMesas(response.datos || []);
    } catch (error) {
      showSnackbar('Error al cargar las mesas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mesa = null) => {
    if (mesa) {
      setEditingMesa(mesa);
      setFormData({
        numeroMesa: mesa.numeroMesa.toString(),
        capacidad: mesa.capacidad.toString(),
      });
    } else {
      setEditingMesa(null);
      setFormData({
        numeroMesa: '',
        capacidad: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMesa(null);
    setFormData({
      numeroMesa: '',
      capacidad: '',
    });
  };

  const handleSubmit = async () => {
    try {
      const mesaData = {
        ...formData,
        numeroMesa: parseInt(formData.numeroMesa),
        capacidad: parseInt(formData.capacidad),
      };

      if (editingMesa) {
        await mesasService.actualizarMesa(editingMesa.id, mesaData);
        showSnackbar('Mesa actualizada exitosamente', 'success');
      } else {
        await mesasService.crearMesa(mesaData);
        showSnackbar('Mesa creada exitosamente', 'success');
      }
      handleCloseDialog();
      fetchMesas();
    } catch (error) {
      showSnackbar('Error al guardar la mesa', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta mesa?')) {
      try {
        await mesasService.eliminarMesa(id);
        showSnackbar('Mesa eliminada exitosamente', 'success');
        fetchMesas();
      } catch (error) {
        showSnackbar('Error al eliminar la mesa', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
        <Typography variant="h4">Gestión de Mesas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Mesa
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Número de Mesa</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mesas.map((mesa) => (
              <TableRow key={mesa.id}>
                <TableCell>{mesa.id}</TableCell>
                <TableCell>{mesa.numeroMesa}</TableCell>
                <TableCell>{mesa.capacidad} personas</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(mesa)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(mesa.id)}
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
          {editingMesa ? 'Editar Mesa' : 'Nueva Mesa'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Número de Mesa"
              type="number"
              value={formData.numeroMesa}
              onChange={(e) => setFormData({ ...formData, numeroMesa: e.target.value })}
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              fullWidth
              label="Capacidad"
              type="number"
              value={formData.capacidad}
              onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingMesa ? 'Actualizar' : 'Crear'}
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

export default MesasPage; 