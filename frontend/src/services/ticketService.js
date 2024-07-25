import axios from 'axios';

const API_URL = 'http://192.168.19.128:8000/demand';

export const fetchTickets = async (token) => {
  const response = await axios.get(`${API_URL}/demands/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data || [];
};

export const fetchDemandTypes = async (token) => {
  const response = await axios.get(`${API_URL}/demand-types/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data || [];
};

export const addNewTicket = async (ticket, token) => {
  const response = await axios.post(`${API_URL}/demands/`, ticket, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchTicketById = async (id, token) => {
  const response = await axios.get(`${API_URL}/demands/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
