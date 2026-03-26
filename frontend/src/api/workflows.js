import api from '../config/axios';
<<<<<<< HEAD

export const saveWorkflow = (data) => api.post('/api/workflows', data);
export const fetchWorkflowById = (id) => api.get(`/api/workflows/${id}`);
export const fetchMyWorkflows = () => api.get('/api/workflows/my');
export const deleteWorkflow = (id) => api.delete(`/api/workflows/${id}`);
export const updateWorkflow = (id, body) => api.patch(`/api/workflows/${id}`, body);
=======
import useAuthStore from '../store/authStore';

const getAuthHeader = () => {
    const token = useAuthStore.getState().token;
    return token ? {Authorization: `Bearer ${token}`} : {};
};

export const saveWorkflow = async ({user_input, result_json, title, tool_ids}) => {
    const response = await api.post(
        '/api/workflows',
        {user_input, result_json, title, tool_ids},
        {headers: getAuthHeader()},
    );
    return response.data;
};

export const fetchWorkflowById = async (id) => {
    const response = await api.get(`/api/workflows/${id}`);
    return response.data;
};

export const fetchMyWorkflows = async () => {
    const response = await api.get('/api/workflows/my', {
        headers: getAuthHeader(),
    });
    return response.data;
};
>>>>>>> origin/feature/frontend-tools
