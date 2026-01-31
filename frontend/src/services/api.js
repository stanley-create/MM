import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getRecords = async () => {
    try {
        const response = await api.get('/records/');
        return response.data;
    } catch (error) {
        console.error("API Error getRecords:", error);
        return [];
    }
};

export const createRecord = async (record) => {
    try {
        const response = await api.post('/records/', record);
        return response.data;
    } catch (error) {
        console.error("API Error createRecord:", error);
        throw error;
    }
};

export const getQuests = async () => {
    try {
        const response = await api.get('/rpg/quests');
        return response.data;
    } catch (error) {
        console.error("API Error getQuests:", error);
        return [];
    }
};

export default api;
