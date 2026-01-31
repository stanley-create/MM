import axios from 'axios';

const BASE_URL = 'http://10.0.2.2:8000'; // For Android Emulator
const MOCK_USER_ID = 'user_123';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'X-User-ID': MOCK_USER_ID,
    },
});

export const recordAPI = {
    create: (data) => api.post('/records/', data),
    list: () => api.get('/records/'),
    getStatus: () => api.get('/records/rpg-status'),
};

export const analysisAPI = {
    getAnalysis: () => api.post('/analyze/'),
};

export default api;
