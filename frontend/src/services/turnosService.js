import api from './api';

export const turnosService = {
  // Obtener todos los turnos
  getTurnos: async () => {
    const response = await api.get('/turnos');
    return response.data;
  },

  // Obtener un turno por ID
  getTurno: async (id) => {
    const response = await api.get(`/turnos/${id}`);
    return response.data;
  },

  // Crear un nuevo turno
  crearTurno: async (turno) => {
    const response = await api.post('/turnos', turno);
    return response.data;
  },

  // Actualizar un turno
  actualizarTurno: async (id, turno) => {
    const response = await api.put(`/turnos/${id}`, turno);
    return response.data;
  },

  // Eliminar un turno
  eliminarTurno: async (id) => {
    const response = await api.delete(`/turnos/${id}`);
    return response.data;
  },
}; 