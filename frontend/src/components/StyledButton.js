import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';

const StyledButton = styled(Button)({
  background: '#2196F3',
  border: 0,
  borderRadius: '50%',
  color: 'white',
  height: 48,
  width: 48,
  minWidth: 48,
  padding: 0,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    background: '#1976D2',
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
  },
});

const StyledMenu = styled(Menu)({
  transition: 'opacity 0.3s ease-in-out',
  '& .MuiPaper-root': {
    background: 'rgba(33, 150, 243, 0.9)',
    backdropFilter: 'blur(8px)',
    borderRadius: 10,
    color: 'white',
    opacity: 1,
    transition: 'opacity 0.3s ease-in-out',
  },
});

const StyledMenuItem = styled(MenuItem)({
  fontSize: '16px',
  fontFamily: 'Rajdhani, sans-serif',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
});

const CustomButton = ({ items }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <StyledButton variant="contained" onClick={handleClick}>
        <AddIcon fontSize="small" />
      </StyledButton>
      <StyledMenu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        MenuListProps={{
          onMouseLeave: handleClose,
        }}
      >
        {items.map((item, index) => (
          <StyledMenuItem
            key={index}
            onClick={() => {
              handleClose();
              item.onClick();
            }}
          >
            {item.label}
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </div>
  );
};

CustomButton.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  ).isRequired,
};

export default CustomButton;
