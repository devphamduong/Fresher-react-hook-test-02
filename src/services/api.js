import axios from '../utils/axios-customize';

export const register = (data) => {
    return axios.post('/api/v1/user/register', { ...data });
};