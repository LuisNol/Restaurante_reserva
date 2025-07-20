import api from './api';

export const menusService = {
  // Obtener todos los elementos del menú
  getMenus: async () => {
    const response = await api.get('/menus');
    return response.data;
  },

  // Obtener un elemento del menú por ID
  getMenu: async (id) => {
    const response = await api.get(`/menus/${id}`);
    return response.data;
  },

  // Crear un nuevo elemento del menú
  crearMenu: async (menu) => {
    const response = await api.post('/menus', menu);
    return response.data;
  },

  // Actualizar un elemento del menú
  actualizarMenu: async (id, menu) => {
    const response = await api.put(`/menus/${id}`, menu);
    return response.data;
  },

  // Eliminar un elemento del menú
  eliminarMenu: async (id) => {
    const response = await api.delete(`/menus/${id}`);
    return response.data;
  },
}; 