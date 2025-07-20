import api from './api';

export const clientesService = {
  // Obtener todos los clientes
  getClientes: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },

  // Obtener un cliente por ID
  getCliente: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  // Crear un nuevo cliente
  crearCliente: async (cliente) => {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  // Actualizar un cliente
  actualizarCliente: async (id, cliente) => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },

  // Eliminar un cliente
  eliminarCliente: async (id) => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  },
}; 