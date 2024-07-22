import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
} from '@mui/material';

const PricingTicket = ({ show, handleClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    group: '',
    unitQuantity: '',
    pricingType: '',
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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = () => {
    onSubmit(formData);
    handleClose();
  };

  const onDrop = (name) => (acceptedFiles) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: [...prevState[name], ...acceptedFiles],
    }));
  };

  const renderDropzone = (name, label) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: onDrop(name),
      multiple: true,
    });

    return (
      <div
        style={{
          marginBottom: '16px',
          border: '1px dashed #cccccc',
          padding: '16px',
          textAlign: 'center',
        }}
      >
        <Typography variant="subtitle1">{label}</Typography>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} name={name} />
          <p>
            Arraste e solte arquivos aqui, ou clique para selecionar arquivos
          </p>
        </div>
        <List>
          {formData[name].map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      </div>
    );
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
          <Typography variant="h6" component="h2">
            Tela de Criação de Tarefas
          </Typography>
          <FormControl component="fieldset" fullWidth margin="normal">
            <Typography component="legend">
              Escola faz parte de grupo educacional
            </Typography>
            <RadioGroup row name="group" onChange={handleInputChange}>
              <FormControlLabel value="yes" control={<Radio />} label="Sim" />
              <FormControlLabel value="no" control={<Radio />} label="Não" />
            </RadioGroup>
          </FormControl>

          {formData.group === 'yes' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Selecione Grupo</InputLabel>
              <Select name="selectedGroup" onChange={handleInputChange}>
                <MenuItem value="new">Novo Grupo</MenuItem>
                <MenuItem value="existing">
                  Selecionar Lista de Escolas
                </MenuItem>
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth
            label="Quantidade de unidades que serão precificadas"
            type="number"
            name="unitQuantity"
            onChange={handleInputChange}
            margin="normal"
          />

          <FormControl component="fieldset" fullWidth margin="normal">
            <Typography component="legend">Tipo de precificação</Typography>
            <RadioGroup row name="pricingType" onChange={handleInputChange}>
              <FormControlLabel
                value="unique"
                control={<Radio />}
                label="Taxa única"
              />
              <FormControlLabel
                value="perUnit"
                control={<Radio />}
                label="Taxa por unidade"
              />
              <FormControlLabel
                value="both"
                control={<Radio />}
                label="Ambos"
              />
            </RadioGroup>
          </FormControl>

          <Typography variant="h6" component="h2" margin="normal">
            Abrir detalhamento de cada unidade
          </Typography>
          <TextField
            fullWidth
            label="CNPJ da Escola"
            name="cnpj"
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Nome Fantasia"
            name="fantasyName"
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Razão Social"
            name="socialReason"
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Código Inep (Select Não Possui)"
            name="inepCode"
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="CEP"
            name="cep"
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Endereço"
            name="address"
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Observações"
            name="observations"
            multiline
            rows={3}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descrição do histórico de fases da prospecção e como se deu a forma contato com a escola"
            name="historyDescription"
            multiline
            rows={3}
            onChange={handleInputChange}
            margin="normal"
          />

          <FormControl component="fieldset" fullWidth margin="normal">
            <Typography component="legend">
              Confirmação com parceiros comerciais
            </Typography>
            <RadioGroup
              row
              name="commercialPartners"
              onChange={handleInputChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Sim" />
              <FormControlLabel value="no" control={<Radio />} label="Não" />
            </RadioGroup>
          </FormControl>

          {formData.commercialPartners === 'yes' && (
            <TextField
              fullWidth
              label="Detalhamento se sim"
              name="partnerDetails"
              multiline
              rows={3}
              onChange={handleInputChange}
              margin="normal"
            />
          )}

          <TextField
            fullWidth
            label="Detalhar o histórico e perfil"
            name="historyProfile"
            multiline
            rows={3}
            onChange={handleInputChange}
            margin="normal"
          />

          {renderDropzone('dataAttachments', 'Anexo dados')}
          {renderDropzone('contractAttachment', 'Anexo Contrato Qualitativo')}
          {renderDropzone(
            'schoolStructureAttachments',
            'Estrutura física da escola',
          )}

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
  onSubmit: PropTypes.func.isRequired,
};

export default PricingTicket;
