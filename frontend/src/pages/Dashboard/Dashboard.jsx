import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  Event as EventIcon,
  ShoppingCart as ShoppingCartIcon,
  TableRestaurant as TableRestaurantIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { clientesService } from '../../services/clientesService';
import { menusService } from '../../services/menusService';
import { reservacionesService } from '../../services/reservacionesService';
import { pedidosService } from '../../services/pedidosService';
import { mesasService } from '../../services/mesasService';
import { empleadosService } from '../../services/empleadosService';
import { turnosService } from '../../services/turnosService';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

function Dashboard() {
  const [stats, setStats] = useState({
    clientes: 0,
    menus: 0,
    reservaciones: 0,
    pedidos: 0,
    mesas: 0,
    empleados: 0,
    turnos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [
          clientesData,
          menusData,
          reservacionesData,
          pedidosData,
          mesasData,
          empleadosData,
          turnosData,
        ] = await Promise.all([
          clientesService.getClientes(),
          menusService.getMenus(),
          reservacionesService.getReservaciones(),
          pedidosService.getPedidos(),
          mesasService.getMesas(),
          empleadosService.getEmpleados(),
          turnosService.getTurnos(),
        ]);

        setStats({
          clientes: clientesData.datos?.length || 0,
          menus: menusData.datos?.length || 0,
          reservaciones: reservacionesData.datos?.length || 0,
          pedidos: pedidosData.datos?.length || 0,
          mesas: mesasData.datos?.length || 0,
          empleados: empleadosData.datos?.length || 0,
          turnos: turnosData.datos?.length || 0,
        });
      } catch (err) {
        setError('Error al cargar las estadísticas');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Resumen general del sistema de gestión del restaurante
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Clientes"
            value={stats.clientes}
            icon={<PeopleIcon sx={{ color: 'white' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Elementos del Menú"
            value={stats.menus}
            icon={<RestaurantIcon sx={{ color: 'white' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reservaciones"
            value={stats.reservaciones}
            icon={<EventIcon sx={{ color: 'white' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pedidos"
            value={stats.pedidos}
            icon={<ShoppingCartIcon sx={{ color: 'white' }} />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Mesas"
            value={stats.mesas}
            icon={<TableRestaurantIcon sx={{ color: 'white' }} />}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Empleados"
            value={stats.empleados}
            icon={<WorkIcon sx={{ color: 'white' }} />}
            color="#7b1fa2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Turnos"
            value={stats.turnos}
            icon={<ScheduleIcon sx={{ color: 'white' }} />}
            color="#388e3c"
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Bienvenido al Sistema de Gestión de Restaurante
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Este sistema te permite gestionar clientes, menús, reservaciones, pedidos, mesas, empleados y turnos de manera eficiente.
          Utiliza el menú lateral para navegar entre las diferentes secciones.
        </Typography>
      </Box>
    </Box>
  );
}

export default Dashboard; 