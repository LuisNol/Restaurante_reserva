import api from './api';

export const pedidosService = {
  // Obtener todos los pedidos
  getPedidos: async () => {
    const response = await api.get('/pedidos');
    return response.data;
  },

  // Obtener un pedido por ID
  getPedido: async (id) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  // Crear un nuevo pedido
  crearPedido: async (pedido) => {
    const response = await api.post('/pedidos', pedido);
    return response.data;
  },

  // Actualizar un pedido
  actualizarPedido: async (id, pedido) => {
    const response = await api.put(`/pedidos/${id}`, pedido);
    return response.data;
  },

  // Eliminar un pedido
  eliminarPedido: async (id) => {
    const response = await api.delete(`/pedidos/${id}`);
    return response.data;
  },
}; 