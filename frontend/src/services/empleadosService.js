import api from './api';

export const empleadosService = {
  // Obtener todos los empleados
  getEmpleados: async () => {
    const response = await api.get('/empleados');
    return response.data;
  },

  // Obtener un empleado por ID
  getEmpleado: async (id) => {
    const response = await api.get(`/empleados/${id}`);
    return response.data;
  },

  // Crear un nuevo empleado
  crearEmpleado: async (empleado) => {
    const response = await api.post('/empleados', empleado);
    return response.data;
  },

  // Actualizar un empleado
  actualizarEmpleado: async (id, empleado) => {
    const response = await api.put(`/empleados/${id}`, empleado);
    return response.data;
  },

  // Eliminar un empleado
  eliminarEmpleado: async (id) => {
    const response = await api.delete(`/empleados/${id}`);
    return response.data;
  },
}; 