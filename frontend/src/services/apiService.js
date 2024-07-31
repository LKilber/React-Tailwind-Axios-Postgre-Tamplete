import axios from 'axios';

const apiService = {
  submitForm: async (formData, demandTypeId, handleClose) => {
    const data = new FormData();

    data.append('group', formData.group);
    data.append('selected_group', formData.selectedGroup);
    data.append('unit_quantity', formData.unitQuantity);
    data.append('pricing_type', formData.pricingType);
    data.append('demand_type', demandTypeId);
    data.append('partner_confirmation', formData.partnerConfirmation);
    formData.attachments.forEach((file) => {
      data.append(`attachments`, file);
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

    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/demand/demands/',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

export default apiService;

const api = axios.create({
  baseURL: 'http://192.168.19.182:8000/demand',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

export const fetchTicketDetails = async (id) => {
  const response = await api.get(`/demands/${id}/associated_tickets/`);
  return response.data[0];
};

export const fetchComments = async (ticketId) => {
  const response = await api.get(`/comments/ticket_comments/`, {
    params: { ticket_id: ticketId },
  });
  return response.data;
};

export const addComment = async (commentData) => {
  const response = await api.post(`/comments/`, commentData);
  return response.data;
};

export const updateTicketStatus = async (id, newStatus) => {
  await api.patch(`/demands/${id}/`, { status: newStatus });
};

export const updateResponsibleSector = async (id, newSector) => {
  await api.patch(`/demands/${id}/`, { responsible_sector: newSector });
};
