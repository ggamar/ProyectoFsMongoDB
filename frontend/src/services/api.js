import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; 

export const createUser = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUsers = async ({search, role, page, limit}) => {
  try {
    const token = localStorage.getItem('authToken');

    if (!token){
      throw new Error('Not authenticated');
    }

    //construir los parametros de la consulta
    const params = {
      search,
      role,
      page,
      limit
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params
    };

    //Realizar la solicitud GET con los parametros y el encabezado Authorization
    const response = await axios.get(`${API_URL}/users`, config);
    return response.data;
  }catch (error) {
    if (error.message === 'Not authenticated'){
      return { user: [] };
    }
    throw error;
  }
};
