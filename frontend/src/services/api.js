import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

export const getEmissions = () => {
  return axios.get(`${API_URL}/emissions`);
};

export const getSummary = () => {
  return axios.get(`${API_URL}/summary`);
};

export const ingestData = (data) => {
  return axios.post(`${API_URL}/ingest`, data);
};

export const seedDemoData = (payload = { records: 96, reset: true }) => {
  return axios.post(`${API_URL}/seed-demo`, payload);
};
