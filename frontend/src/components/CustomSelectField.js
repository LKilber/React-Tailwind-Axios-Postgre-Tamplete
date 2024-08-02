import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

// Define the CustomSelectField component
const CustomSelectField = ({
  label,
  name,
  value,
  onChange,
  options = [], // Default to an empty array
  fullWidth = true,
  margin = 'normal',
  variant = 'outlined',
  helperText = '',
  error = false,
  disabled = false,
  ...props
}) => {
  return (
    <FormControl
      fullWidth={fullWidth}
      margin={margin}
      variant={variant}
      error={error}
      disabled={disabled}
    >
      <InputLabel
        InputLabelProps={{
          style: { fontSize: '0.875rem' }, // Ajuste o tamanho da label
        }}
      >
        {label}
      </InputLabel>
      <Select
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      >
        {options.length > 0 ? (
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No options available</MenuItem> // Handle empty options
        )}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

// Define PropTypes for CustomSelectField
CustomSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  fullWidth: PropTypes.bool,
  margin: PropTypes.oneOf(['none', 'dense', 'normal']),
  variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
  helperText: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
};

// Define default props
CustomSelectField.defaultProps = {
  options: [], // Ensure options have a default value
  fullWidth: true,
  margin: 'normal',
  variant: 'standard',
  helperText: '',
  error: false,
  disabled: false,
};

// Export the component
export default CustomSelectField;
