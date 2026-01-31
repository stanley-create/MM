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

export const communityAPI = {
    join: (guildId) => api.post(`/community/join/${guildId}`),
    list: () => api.get('/community/'),
};

export const getQuests = async () => {
    // Mock response for now if backend not ready
    return [
        { id: '1', title: 'Daily Login', description: 'Log in to the app', progress: 1, target: 1, reward_exp: 10 },
        { id: '2', title: 'Low Carbon', description: 'Spend < 100 on transport', progress: 50, target: 100, reward_exp: 50 },
    ];
    // return api.get('/rpg/quests').then(res => res.data);
}

export default api;
