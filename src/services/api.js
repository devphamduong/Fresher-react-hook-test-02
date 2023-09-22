import axios from '../utils/axios-customize';

export const register = (data) => {
    return axios.post('/api/v1/user/register', { ...data });
};

export const login = (data) => {
    return axios.post('/api/v1/auth/login', { ...data });
};

export const getAccount = () => {
    return axios.get('/api/v1/auth/account');
};