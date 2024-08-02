import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';
import useFetchSchoolGroups from '../../hooks/useFetchSchoolGroups';
import CustomTextField from '../CustomTextField';
import CustomSelectField from '../CustomSelectField';
import AttachmentDropzone from '../AttachmentDropzone';
import apiService from '../../services/apiService';
import CustomSwitch from '../StyledSwitch';

import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Grid,
  Typography,
  FormControl,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

const PricingTicket = ({ show, handleClose, demandType, onSubmit }) => {
  const { user } = useAuth();
  const groups = useFetchSchoolGroups(user);

  const [formData, setFormData] = useState({
    group: '',
    unitQuantity: 0,
    groupedPricing: '',
    selectedGroup: '',
    partnerConfirmation: '',
    attachments: [],
    units: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const newUnits = Array.from({ length: formData.unitQuantity }, () => ({
      cnpj: '',
      fantasyName: '',
      socialReason: '',
      inepCode: '',
      cep: '',
      address: '',
      observations: '',
    }));
    setFormData((prevState) => ({ ...prevState, units: newUnits }));
  }, [formData.unitQuantity]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    console.log(e.target);

    if (typeof index === 'number') {
      const updatedUnits = [...formData.units];
      updatedUnits[index][name] = value;
      setFormData((prevState) => ({ ...prevState, units: updatedUnits }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleFormSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      onSubmit(
        await apiService.submitForm(formData, demandType.id, handleClose),
      );
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('There was an error submitting the form!', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDrop = (acceptedFiles) => {
    setFormData((prevState) => ({
      ...prevState,
      attachments: [...prevState.attachments, ...acceptedFiles],
    }));
  };

  const onRemove = (fileIndex) => {
    setFormData((prevState) => ({
      ...prevState,
      attachments: prevState.attachments.filter(
        (_, index) => index !== fileIndex,
      ),
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked.toString(), // Convert to string if your data structure expects string
    }));
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vw', // Largura fixa
    height: '95vh', // Altura fixa
    bgcolor: 'background.paper',
    boxShadow: 12,
    borderRadius: '12px',
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  };

  const NavbarStyle = {
    backgroundColor: '#F5F5F5', // Light gray color
    color: '#333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 8px',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    height: '56px', // Height to align properly
    boxShadow: 'none', // Remove shadow
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
        <Box sx={style}>
          {/* Barra de navegação superior com botão de fechamento */}
          <AppBar position="static" sx={NavbarStyle}>
            <Toolbar variant="dense" sx={{ width: '100%', p: 0 }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Detalhes do Modal
              </Typography>
              <IconButton edge="end" color="inherit" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Conteúdo do Modal */}
          <Grid container spacing={1} sx={{ marginTop: 1 }}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <FormControl component="fieldset" fullWidth margin="normal">
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <Typography component="legend" variant="body2">
                          Precificação Agrupada?
                        </Typography>
                      </Grid>
                      <Grid item>
                        <CustomSwitch
                          name="groupedPricing"
                          value={formData.groupedPricing}
                          onChange={handleSwitchChange}
                        />
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>

                <Grid item xs={4}>
                  <CustomSelectField
                    label="Grupo Educacional:"
                    name="selectedGroup"
                    value={formData.selectedGroup}
                    onChange={(e) => handleInputChange(e)}
                    fullWidth
                    margin="normal"
                  >
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </CustomSelectField>
                </Grid>

                <Grid item xs={4}>
                  <CustomTextField
                    label="Quantidade de Unidades:"
                    type="number"
                    name="unitQuantity"
                    value={formData.unitQuantity}
                    onChange={(e) => handleInputChange(e)}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Grid>

            {formData.units.map((unit, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography>Unidade {index + 1}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={3}>
                      <CustomTextField
                        label="CNPJ da Escola"
                        name="cnpj"
                        value={unit.cnpj}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <CustomTextField
                        label="Nome Fantasia"
                        name="fantasyName"
                        value={unit.fantasyName}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <CustomTextField
                        label="Razão Social"
                        name="socialReason"
                        value={unit.socialReason}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <CustomTextField
                        label="Código Inep"
                        name="inepCode"
                        value={unit.inepCode}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <CustomTextField
                        label="CEP"
                        name="cep"
                        value={unit.cep}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <CustomTextField
                        label="Endereço"
                        name="address"
                        value={unit.address}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        label="Observações"
                        name="observations"
                        value={unit.observations}
                        multiline
                        rows={1}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}

            <Grid item xs={6}>
              <AttachmentDropzone
                name="attachments"
                label="Anexos"
                formData={formData}
                onDrop={onDrop}
                onRemove={onRemove}
              />
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleFormSubmit}
              >
                Salvar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

PricingTicket.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  demandType: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default PricingTicket;
