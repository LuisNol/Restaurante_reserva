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
  InputAdornment,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { reservacionesService } from '../../services/reservacionesService';
import { clientesService } from '../../services/clientesService';
import { mesasService } from '../../services/mesasService';

function ReservacionesPage() {
  const [reservaciones, setReservaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReservacion, setEditingReservacion] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('nombre');
  const [formData, setFormData] = useState({
    clienteId: '',
    mesaId: '',
    fechaReservacion: '',
    horaReservacion: '',
    cantidadPersonas: '',
  });

  const searchTypes = [
    { value: 'nombre', label: 'Nombre del Cliente' },
    { value: 'telefono', label: 'Teléfono' },
    { value: 'correo', label: 'Correo Electrónico' },
    { value: 'fecha', label: 'Fecha de Reservación' },
    { value: 'mesa', label: 'Número de Mesa' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reservacionesData, clientesData, mesasData] = await Promise.all([
        reservacionesService.getReservaciones(),
        clientesService.getClientes(),
        mesasService.getMesas(),
      ]);
      setReservaciones(reservacionesData.datos || []);
      setClientes(clientesData.datos || []);
      setMesas(mesasData.datos || []);
    } catch (error) {
      showSnackbar('Error al cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (reservacion = null) => {
    if (reservacion) {
      setEditingReservacion(reservacion);
      setFormData({
        clienteId: reservacion.clienteId.toString(),
        mesaId: reservacion.mesaId.toString(),
        fechaReservacion: reservacion.fechaReservacion,
        horaReservacion: reservacion.horaReservacion,
        cantidadPersonas: reservacion.cantidadPersonas.toString(),
      });
    } else {
      setEditingReservacion(null);
      setFormData({
        clienteId: '',
        mesaId: '',
        fechaReservacion: '',
        horaReservacion: '',
        cantidadPersonas: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReservacion(null);
    setFormData({
      clienteId: '',
      mesaId: '',
      fechaReservacion: '',
      horaReservacion: '',
      cantidadPersonas: '',
    });
  };

  const handleSubmit = async () => {
    try {
      const reservacionData = {
        ...formData,
        clienteId: parseInt(formData.clienteId),
        mesaId: parseInt(formData.mesaId),
        cantidadPersonas: parseInt(formData.cantidadPersonas),
      };

      if (editingReservacion) {
        await reservacionesService.actualizarReservacion(editingReservacion.id, reservacionData);
        showSnackbar('Reservación actualizada exitosamente', 'success');
      } else {
        await reservacionesService.crearReservacion(reservacionData);
        showSnackbar('Reservación creada exitosamente', 'success');
      }
      handleCloseDialog();
      fetchData();
    } catch (error) {
      showSnackbar('Error al guardar la reservación', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reservación?')) {
      try {
        await reservacionesService.eliminarReservacion(id);
        showSnackbar('Reservación eliminada exitosamente', 'success');
        fetchData();
      } catch (error) {
        showSnackbar('Error al eliminar la reservación', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getClienteName = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'N/A';
  };

  const getClienteTelefono = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.telefono : 'N/A';
  };

  const getClienteCorreo = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.correoElectronico : 'N/A';
  };

  const getMesaNumber = (mesaId) => {
    const mesa = mesas.find(m => m.id === mesaId);
    return mesa ? mesa.numeroMesa : 'N/A';
  };

  // Función de búsqueda
  const filteredReservaciones = reservaciones.filter(reservacion => {
    if (!searchTerm) return true;

    const cliente = clientes.find(c => c.id === reservacion.clienteId);
    const mesa = mesas.find(m => m.id === reservacion.mesaId);

    switch (searchType) {
      case 'nombre':
        return cliente && 
          (cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()));
      case 'telefono':
        return cliente && cliente.telefono.includes(searchTerm);
      case 'correo':
        return cliente && cliente.correoElectronico.toLowerCase().includes(searchTerm.toLowerCase());
      case 'fecha':
        return reservacion.fechaReservacion.includes(searchTerm);
      case 'mesa':
        return mesa && mesa.numeroMesa.toString().includes(searchTerm);
      default:
        return true;
    }
  });

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchType('nombre');
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
        <Typography variant="h4">Gestión de Reservaciones</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Reservación
        </Button>
      </Box>

      {/* Sistema de Búsqueda */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔍 Buscar Reservación
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Busca reservaciones por nombre del cliente, teléfono, correo electrónico, fecha o número de mesa
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Búsqueda</InputLabel>
                <Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  label="Tipo de Búsqueda"
                >
                  {searchTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder={`Buscar por ${searchTypes.find(t => t.value === searchType)?.label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearSearch} size="small">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearSearch}
                startIcon={<ClearIcon />}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>

          {searchTerm && (
            <Box mt={2}>
              <Typography variant="body2" color="primary">
                📊 Mostrando {filteredReservaciones.length} de {reservaciones.length} reservaciones
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Mesa</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Personas</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservaciones.map((reservacion) => (
              <TableRow key={reservacion.id}>
                <TableCell>{reservacion.id}</TableCell>
                <TableCell>{getClienteName(reservacion.clienteId)}</TableCell>
                <TableCell>{getClienteTelefono(reservacion.clienteId)}</TableCell>
                <TableCell>{getClienteCorreo(reservacion.clienteId)}</TableCell>
                <TableCell>Mesa {getMesaNumber(reservacion.mesaId)}</TableCell>
                <TableCell>{reservacion.fechaReservacion}</TableCell>
                <TableCell>{reservacion.horaReservacion}</TableCell>
                <TableCell>{reservacion.cantidadPersonas}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(reservacion)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(reservacion.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredReservaciones.length === 0 && searchTerm && (
        <Box mt={3} textAlign="center">
          <Typography variant="h6" color="textSecondary">
            No se encontraron reservaciones con los criterios de búsqueda
          </Typography>
          <Button
            variant="outlined"
            onClick={handleClearSearch}
            sx={{ mt: 2 }}
          >
            Limpiar búsqueda
          </Button>
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingReservacion ? 'Editar Reservación' : 'Nueva Reservación'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Cliente</InputLabel>
              <Select
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                label="Cliente"
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.id.toString()}>
                    {cliente.nombre} {cliente.apellido} - {cliente.telefono}
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
              label="Fecha de Reservación"
              type="date"
              value={formData.fechaReservacion}
              onChange={(e) => setFormData({ ...formData, fechaReservacion: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Hora de Reservación"
              type="time"
              value={formData.horaReservacion}
              onChange={(e) => setFormData({ ...formData, horaReservacion: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Cantidad de Personas"
              type="number"
              value={formData.cantidadPersonas}
              onChange={(e) => setFormData({ ...formData, cantidadPersonas: e.target.value })}
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingReservacion ? 'Actualizar' : 'Crear'}
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

export default ReservacionesPage; 