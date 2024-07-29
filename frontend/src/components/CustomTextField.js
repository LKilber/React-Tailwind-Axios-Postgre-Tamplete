import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';

const CustomTextField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  multiline = false,
  rows = 1,
}) => (
  <TextField
    fullWidth
    variant="standard"
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    type={type}
    margin="normal"
    multiline={multiline}
    rows={rows}
    InputProps={{
      style: { fontSize: '0.875rem' }, // Ajuste o tamanho do texto
    }}
    InputLabelProps={{
      style: { fontSize: '0.875rem' }, // Ajuste o tamanho da label
    }}
  />
);

CustomTextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
};

export default CustomTextField;
