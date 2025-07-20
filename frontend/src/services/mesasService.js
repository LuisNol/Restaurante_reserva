import api from './api';

export const mesasService = {
  // Obtener todas las mesas
  getMesas: async () => {
    const response = await api.get('/mesas');
    return response.data;
  },

  // Obtener una mesa por ID
  getMesa: async (id) => {
    const response = await api.get(`/mesas/${id}`);
    return response.data;
  },

  // Crear una nueva mesa
  crearMesa: async (mesa) => {
    const response = await api.post('/mesas', mesa);
    return response.data;
  },

  // Actualizar una mesa
  actualizarMesa: async (id, mesa) => {
    const response = await api.put(`/mesas/${id}`, mesa);
    return response.data;
  },

  // Eliminar una mesa
  eliminarMesa: async (id) => {
    const response = await api.delete(`/mesas/${id}`);
    return response.data;
  },
}; 