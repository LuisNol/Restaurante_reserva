import api from './api';

export const reservacionesService = {
  // Obtener todas las reservaciones
  getReservaciones: async () => {
    const response = await api.get('/reservaciones');
    return response.data;
  },

  // Obtener una reservación por ID
  getReservacion: async (id) => {
    const response = await api.get(`/reservaciones/${id}`);
    return response.data;
  },

  // Crear una nueva reservación
  crearReservacion: async (reservacion) => {
    const response = await api.post('/reservaciones', reservacion);
    return response.data;
  },

  // Actualizar una reservación
  actualizarReservacion: async (id, reservacion) => {
    const response = await api.put(`/reservaciones/${id}`, reservacion);
    return response.data;
  },

  // Eliminar una reservación
  eliminarReservacion: async (id) => {
    const response = await api.delete(`/reservaciones/${id}`);
    return response.data;
  },
}; 