import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';
import { useDropzone } from 'react-dropzone';
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
} from '@mui/material';

const PricingTicket = ({ show, handleClose }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    group: '',
    unitQuantity: 0,
    pricingType: '',
    selectedGroup: '',
    units: [],
  });

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const newUnits = Array.from({ length: formData.unitQuantity }, () => ({
      cnpj: '',
      fantasyName: '',
      socialReason: '',
      inepCode: '',
      cep: '',
      address: '',
      observations: '',
      historyDescription: '',
      commercialPartners: '',
      partnerDetails: '',
      historyProfile: '',
      dataAttachments: [],
      contractAttachment: [],
      schoolStructureAttachments: [],
    }));
    setFormData((prevState) => ({ ...prevState, units: newUnits }));
  }, [formData.unitQuantity]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('access_token');
          const response = await axios.get(
            'http://192.168.19.128:8000/demand/pricing-groups/',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          setGroups(response.data);
        } catch (error) {
          console.error('There was an error fetching the groups!', error);
        }
      }
    };

    fetchGroups();
  }, [user]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (typeof index === 'number') {
      const updatedUnits = [...formData.units];
      updatedUnits[index][name] = value;
      setFormData((prevState) => ({ ...prevState, units: updatedUnits }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleFormSubmit = () => {
    const data = new FormData();

    console.log('Initial formData:', formData);

    data.append('group', formData.group);
    data.append('selected_group', formData.selectedGroup);
    data.append('unit_quantity', formData.unitQuantity);
    data.append('pricing_type', formData.pricingType);

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
        console.log(`data_attachments[${fileIndex}]`, file);
      });
      unit.contractAttachment.forEach((file, fileIndex) => {
        data.append(`units[${index}].contract_attachment[${fileIndex}]`, file);
        console.log(`contract_attachment[${fileIndex}]`, file);
      });
      unit.schoolStructureAttachments.forEach((file, fileIndex) => {
        data.append(
          `units[${index}].school_structure_attachments[${fileIndex}]`,
          file,
        );
        console.log(`school_structure_attachments[${fileIndex}]`, file);
      });
    });

    // Log each entry in FormData to verify its contents
    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const token = localStorage.getItem('access_token');
    axios
      .post('http://192.168.19.128:8000/demand/pricing-tickets/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Form submitted successfully:', response.data);
        handleClose();
      })
      .catch((error) => {
        console.error(
          'There was an error submitting the form!',
          error.response.data,
        );
      });
  };

  const onDrop = (name, index) => (acceptedFiles) => {
    const updatedUnits = [...formData.units];
    updatedUnits[index][name] = [
      ...updatedUnits[index][name],
      ...acceptedFiles,
    ];
    setFormData((prevState) => ({ ...prevState, units: updatedUnits }));
  };

  const RenderDropzone = ({ name, label, index }) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: onDrop(name, index),
      multiple: true,
    });

    return (
      <div
        style={{
          border: '1px dashed #cccccc',
          padding: '8px',
          textAlign: 'center',
          marginBottom: '8px',
        }}
      >
        <Typography variant="subtitle2">{label}</Typography>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} name={name} />
          <p style={{ margin: '8px 0' }}>
            Arraste e solte arquivos aqui, ou clique para selecionar arquivos
          </p>
        </div>
        <List dense>
          {formData.units[index][name].map((file, fileIndex) => (
            <ListItem key={fileIndex}>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  };

  RenderDropzone.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
  };

  return (
    <Modal
      open={show}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={show}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxHeight: '90%',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Tela de Criação de Tarefas
          </Typography>
          <FormControl component="fieldset" fullWidth margin="normal">
            <Typography component="legend">
              Escola faz parte de grupo educacional
            </Typography>
            <RadioGroup
              row
              name="group"
              value={formData.group}
              onChange={(e) => handleInputChange(e)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Sim" />
              <FormControlLabel value="no" control={<Radio />} label="Não" />
            </RadioGroup>
          </FormControl>

          {formData.group === 'yes' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Selecione Grupo</InputLabel>
              <Select
                name="selectedGroup"
                value={formData.selectedGroup}
                onChange={(e) => handleInputChange(e)}
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth
            label="Quantidade de unidades que serão precificadas"
            type="number"
            name="unitQuantity"
            value={formData.unitQuantity}
            onChange={(e) => handleInputChange(e)}
            margin="normal"
          />

          <FormControl component="fieldset" fullWidth margin="normal">
            <Typography component="legend">Tipo de precificação</Typography>
            <RadioGroup
              row
              name="pricingType"
              value={formData.pricingType}
              onChange={(e) => handleInputChange(e)}
            >
              <FormControlLabel
                value="Agrupada"
                control={<Radio />}
                label="Taxa Agrupada"
              />
              <FormControlLabel
                value="Por Unidade"
                control={<Radio />}
                label="Taxa por Unidade"
              />
            </RadioGroup>
          </FormControl>

          <Typography variant="h6" component="h2" margin="normal">
            Abrir detalhamento de cada unidade
          </Typography>

          {formData.units.map((unit, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography variant="subtitle1" component="h3">
                Unidade {index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CNPJ da Escola"
                    name="cnpj"
                    value={unit.cnpj}
                    onChange={(e) => handleInputChange(e, index)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome Fantasia"
                    name="fantasyName"
                    value={unit.fantasyName}
                    onChange={(e) => handleInputChange(e, index)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Razão Social"
                    name="socialReason"
                    value={unit.socialReason}
                    onChange={(e) => handleInputChange(e, index)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Código Inep (Select Não Possui)"
                    name="inepCode"
                    value={unit.inepCode}
                    onChange={(e) => handleInputChange(e, index)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CEP"
                    name="cep"
                    value={unit.cep}
                    onChange={(e) => handleInputChange(e, index)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    name="address"
                    value={unit.address}
                    onChange={(e) => handleInputChange(e, index)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Observações"
                    name="observations"
                    value={unit.observations}
                    multiline
                    rows={3}
                    onChange={(e) => handleInputChange(e, index)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Descrição do histórico de fases da prospecção e como se deu a forma contato com a escola"
                    name="historyDescription"
                    value={unit.historyDescription}
                    multiline
                    rows={3}
                    onChange={(e) => handleInputChange(e, index)}
                    margin="normal"
                  />
                </Grid>
              </Grid>

              <FormControl component="fieldset" fullWidth margin="normal">
                <Typography component="legend">
                  Confirmação com parceiros comerciais
                </Typography>
                <RadioGroup
                  row
                  name="commercialPartners"
                  value={unit.commercialPartners}
                  onChange={(e) => handleInputChange(e, index)}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Sim"
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="Não"
                  />
                </RadioGroup>
              </FormControl>

              {unit.commercialPartners === 'yes' && (
                <TextField
                  fullWidth
                  label="Detalhamento se sim"
                  name="partnerDetails"
                  value={unit.partnerDetails}
                  multiline
                  rows={3}
                  onChange={(e) => handleInputChange(e, index)}
                  margin="normal"
                />
              )}

              <TextField
                fullWidth
                label="Detalhar o histórico e perfil"
                name="historyProfile"
                value={unit.historyProfile}
                multiline
                rows={3}
                onChange={(e) => handleInputChange(e, index)}
                margin="normal"
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <RenderDropzone
                    name="dataAttachments"
                    label="Anexo dados"
                    index={index}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <RenderDropzone
                    name="contractAttachment"
                    label="Anexo Contrato Qualitativo"
                    index={index}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <RenderDropzone
                    name="schoolStructureAttachments"
                    label="Estrutura física da escola"
                    index={index}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}

          <Box textAlign="center" margin="normal">
            <Button
              variant="contained"
              color="primary"
              onClick={handleFormSubmit}
            >
              Salvar
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

PricingTicket.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default PricingTicket;
