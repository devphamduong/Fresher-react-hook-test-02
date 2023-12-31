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

export const deleteUser = (id) => {
    return axios.delete(`/api/v1/user/${id}`);
};

export const getBookPaginate = (query) => {
    return axios.get(`/api/v1/book?${query}`);
};

export const createBook = (data) => {
    return axios.post('/api/v1/book', { ...data });
};

export const updateBook = (id, data) => {
    return axios.put(`/api/v1/book/${id}`, { ...data });
};

export const deleteBook = (id) => {
    return axios.delete(`/api/v1/book/${id}`);
};

export const getAllBookCategories = () => {
    return axios.get(`/api/v1/database/category`);
};

export const callUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        },
    });
};

export const getBookDetail = (id) => {
    return axios.get(`/api/v1/book/${id}`);
};

export const createOrder = (data) => {
    return axios.post(`/api/v1/order`, { ...data });
};

export const getOrderHistory = () => {
    return axios.get(`/api/v1/history`);
};

export const uploadAvatar = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "avatar"
        },
    });
};

export const updateInfo = (data) => {
    return axios.put(`/api/v1/user`, { ...data });
};

export const changePassword = (data) => {
    return axios.post(`/api/v1/user/change-password`, { ...data });
};

export const getDashboard = () => {
    return axios.get(`/api/v1/database/dashboard`);
};

export const getOrderPaginate = (query) => {
    return axios.get(`/api/v1/order?${query}`);
};