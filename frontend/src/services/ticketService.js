// src/services/ticketService.js

import axios from 'axios';
import Cookies from 'js-cookie'; // Importa js-cookie para acessar o token

// Cria uma instância Axios com configuração padrão
const api = axios.create({
  baseURL: 'http://192.168.19.188:8000/demand',
});

// Função utilitária para lidar com erros da API
const handleApiError = (error) => {
  if (error.response) {
    console.error('API Error:', error.response.data);
    throw new Error(`API request failed with status ${error.response.status}`);
  } else if (error.request) {
    console.error('No response received:', error.request);
    throw new Error('No response received from the API');
  } else {
    console.error('Error setting up request:', error.message);
    throw new Error('Error setting up request');
  }
};

// Função para obter o token de autenticação
const getAuthToken = () => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

// Busca todos os tickets
export const fetchTickets = async () => {
  try {
    const response = await api.get('/demands/', {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data || [];
  } catch (error) {
    handleApiError(error);
  }
};

// Busca todos os tipos de demanda
export const fetchDemandTypes = async () => {
  try {
    const response = await api.get('/demand-types/', {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data || [];
  } catch (error) {
    handleApiError(error);
  }
};

// Adiciona um novo ticket
export const addNewTicket = async (ticket) => {
  try {
    const response = await api.post('/demands/', ticket, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Busca um ticket pelo ID
export const fetchTicketById = async (id) => {
  try {
    const response = await api.get(`/demands/${id}/`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Submete um formulário de ticket
export const submitTicket = {
  submitForm: async (formData, demandTypeId, handleClose) => {
    const data = new FormData();

    data.append('group', formData.group);
    data.append('selected_group', formData.selectedGroup);
    data.append('unit_quantity', formData.unitQuantity);
    data.append('pricing_type', formData.pricingType);
    data.append('demand_type', demandTypeId);
    data.append('partner_confirmation', formData.partnerConfirmation);

    formData.attachments.forEach((file) => {
      data.append('attachments', file);
    });

    formData.units.forEach((unit, index) => {
      data.append(`units[${index}].cnpj`, unit.cnpj);
      data.append(`units[${index}].fantasy_name`, unit.fantasyName);
      data.append(`units[${index}].social_reason`, unit.socialReason);
      data.append(`units[${index}].inep_code`, unit.inepCode);
      data.append(`units[${index}].cep`, unit.cep);
      data.append(`units[${index}].address`, unit.address);
      data.append(`units[${index}].observations`, unit.observations);
    });

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/demand/demands/',
        data,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      handleClose();
      return response.data;
    } catch (error) {
      console.error(
        'There was an error submitting the form!',
        error.response.data,
      );
      throw error;
    }
  },
};

// Busca detalhes de um ticket associado pelo ID
export const fetchTicketDetails = async (id) => {
  try {
    const response = await api.get(`/demands/${id}/associated_tickets/`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data[0];
  } catch (error) {
    handleApiError(error);
  }
};

// Busca comentários de um ticket pelo ID
export const fetchComments = async (ticketId) => {
  try {
    const response = await api.get(`/comments/ticket_comments/`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      params: { ticket_id: ticketId },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Adiciona um novo comentário
export const addComment = async (commentData) => {
  try {
    const response = await api.post(`/comments/`, commentData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Atualiza o status de um ticket
export const updateTicketStatus = async (id, newStatus) => {
  try {
    await api.patch(
      `/demands/${id}/`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      },
    );
  } catch (error) {
    handleApiError(error);
  }
};

// Atualiza o setor responsável por um ticket
export const updateResponsibleSector = async (id, newSector) => {
  try {
    await api.patch(
      `/demands/${id}/`,
      { responsible_sector: newSector },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      },
    );
  } catch (error) {
    handleApiError(error);
  }
};
