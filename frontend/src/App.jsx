import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import ClientesPage from './pages/Clientes/ClientesPage';
import MenuPage from './pages/Menu/MenuPage';
import ReservacionesPage from './pages/Reservaciones/ReservacionesPage';
import PedidosPage from './pages/Pedidos/PedidosPage';
import MesasPage from './pages/Mesas/MesasPage';
import EmpleadosPage from './pages/Empleados/EmpleadosPage';
import TurnosPage from './pages/Turnos/TurnosPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="reservaciones" element={<ReservacionesPage />} />
            <Route path="pedidos" element={<PedidosPage />} />
            <Route path="mesas" element={<MesasPage />} />
            <Route path="empleados" element={<EmpleadosPage />} />
            <Route path="turnos" element={<TurnosPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
