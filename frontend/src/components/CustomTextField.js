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
  helperText = '', // Add a helperText prop
  error = false, // Add an error prop for validation
}) => (
  <TextField
    shrimk
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
    helperText={helperText} // Add the helperText prop
    error={error} // Add the error prop for styling
    InputProps={{
      style: { fontSize: '0.875rem' }, // Adjust the text size
    }}
    InputLabelProps={{
      style: { fontSize: '0.875rem' }, // Adjust the label size
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
  helperText: PropTypes.string, // Define the helperText prop type
  error: PropTypes.bool, // Define the error prop type
};

CustomTextField.defaultProps = {
  type: 'text',
  multiline: false,
  rows: 1,
  helperText: '', // Default helper text to an empty string
  error: false, // Default error to false
};

export default CustomTextField;
