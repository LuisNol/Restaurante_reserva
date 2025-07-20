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
import { clientesService } from '../../services/clientesService';

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('nombre');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correoElectronico: '',
  });

  const searchTypes = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'apellido', label: 'Apellido' },
    { value: 'telefono', label: 'Teléfono' },
    { value: 'correo', label: 'Correo Electrónico' },
  ];

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await clientesService.getClientes();
      setClientes(response.datos || []);
    } catch (error) {
      showSnackbar('Error al cargar los clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (cliente = null) => {
    if (cliente) {
      setEditingCliente(cliente);
      setFormData({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        telefono: cliente.telefono,
        correoElectronico: cliente.correoElectronico,
      });
    } else {
      setEditingCliente(null);
      setFormData({
        nombre: '',
        apellido: '',
        telefono: '',
        correoElectronico: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCliente(null);
    setFormData({
      nombre: '',
      apellido: '',
      telefono: '',
      correoElectronico: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingCliente) {
        await clientesService.actualizarCliente(editingCliente.id, formData);
        showSnackbar('Cliente actualizado exitosamente', 'success');
      } else {
        await clientesService.crearCliente(formData);
        showSnackbar('Cliente creado exitosamente', 'success');
      }
      handleCloseDialog();
      fetchClientes();
    } catch (error) {
      showSnackbar('Error al guardar el cliente', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await clientesService.eliminarCliente(id);
        showSnackbar('Cliente eliminado exitosamente', 'success');
        fetchClientes();
      } catch (error) {
        showSnackbar('Error al eliminar el cliente', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Función de búsqueda
  const filteredClientes = clientes.filter(cliente => {
    if (!searchTerm) return true;

    switch (searchType) {
      case 'nombre':
        return cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      case 'apellido':
        return cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase());
      case 'telefono':
        return cliente.telefono.includes(searchTerm);
      case 'correo':
        return cliente.correoElectronico.toLowerCase().includes(searchTerm.toLowerCase());
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
        <Typography variant="h4">Gestión de Clientes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Cliente
        </Button>
      </Box>

      {/* Sistema de Búsqueda */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔍 Buscar Cliente
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Busca clientes por nombre, apellido, teléfono o correo electrónico
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Tipo de Búsqueda"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                {searchTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </TextField>
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
                📊 Mostrando {filteredClientes.length} de {clientes.length} clientes
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
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Correo Electrónico</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.id}</TableCell>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.apellido}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
                <TableCell>{cliente.correoElectronico}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(cliente)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(cliente.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredClientes.length === 0 && searchTerm && (
        <Box mt={3} textAlign="center">
          <Typography variant="h6" color="textSecondary">
            No se encontraron clientes con los criterios de búsqueda
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
          {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Apellido"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Correo Electrónico"
              type="email"
              value={formData.correoElectronico}
              onChange={(e) => setFormData({ ...formData, correoElectronico: e.target.value })}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCliente ? 'Actualizar' : 'Crear'}
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

export default ClientesPage; 