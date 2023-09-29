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

export const logout = () => {
    return axios.post('/api/v1/auth/logout');
};

export const getUserPaginate = (query) => {
    return axios.get(`/api/v1/user?${query}`);
};

export const createUser = (data) => {
    return axios.post('/api/v1/user', { ...data });
};

export const bulkCreateUser = (data) => {
    return axios.post('/api/v1/user/bulk-create', data);
};

export const updateUser = (data) => {
    return axios.put('/api/v1/user', { ...data });
};