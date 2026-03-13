import api from '../config/axios';

export const fetchTools = async () => {
  const response = await api.get('/api/tools');
  return response.data.data;
};

