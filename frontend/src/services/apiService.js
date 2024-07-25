import axios from 'axios';

const apiService = {
  submitForm: async (formData, demandTypeId, handleClose) => {
    const data = new FormData();

    data.append('group', formData.group);
    data.append('selected_group', formData.selectedGroup);
    data.append('unit_quantity', formData.unitQuantity);
    data.append('pricing_type', formData.pricingType);
    data.append('demand_type', demandTypeId);

    formData.units.forEach((unit, index) => {
      data.append(`units[${index}].cnpj`, unit.cnpj);
      data.append(`units[${index}].fantasy_name`, unit.fantasyName);
      data.append(`units[${index}].social_reason`, unit.socialReason);
      data.append(`units[${index}].inep_code`, unit.inepCode);
      data.append(`units[${index}].cep`, unit.cep);
      data.append(`units[${index}].address`, unit.address);
      data.append(`units[${index}].observations`, unit.observations);
      data.append(
        `units[${index}].history_description`,
        unit.historyDescription,
      );
      data.append(
        `units[${index}].commercial_partners`,
        unit.commercialPartners,
      );
      data.append(`units[${index}].partner_details`, unit.partnerDetails);
      data.append(`units[${index}].history_profile`, unit.historyProfile);

      unit.dataAttachments.forEach((file, fileIndex) => {
        data.append(`units[${index}].data_attachments[${fileIndex}]`, file);
      });
      unit.contractAttachment.forEach((file, fileIndex) => {
        data.append(`units[${index}].contract_attachment[${fileIndex}]`, file);
      });
      unit.schoolStructureAttachments.forEach((file, fileIndex) => {
        data.append(
          `units[${index}].school_structure_attachments[${fileIndex}]`,
          file,
        );
      });
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
