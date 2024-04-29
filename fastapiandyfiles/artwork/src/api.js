// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Adjust this to your FastAPI server URL

export const fetchGraphData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/graph-data`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch graph data:', error);
        return null;
    }
};
