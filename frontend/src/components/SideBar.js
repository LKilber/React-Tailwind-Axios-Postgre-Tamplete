import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  ExpandLess,
  ExpandMore,
  Close,
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  ManageAccounts as ManageAccountsIcon,
  Settings as SettingsIcon,
  FiberManualRecord as DotIcon, // Import Dot Icon
} from '@mui/icons-material'; // Import additional icons
import '../styles/SideBar.css'; // Import the CSS

const Sidebar = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();
  const [submenuState, setSubmenuState] = useState({
    analises: false,
    gerenciamento: false,
  });

  const handleSubmenuClick = (submenu) => {
    setSubmenuState((prevState) => ({
      ...prevState,
      [submenu]: !prevState[submenu],
    }));
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      classes={{ paper: 'MuiDrawer-paper' }} // Add custom class
    >
      {/* Close Button */}
      <div className="Sidebar-header">
        <Tooltip title="Close">
          <IconButton onClick={toggleDrawer(false)} className="CloseButton">
            <Close />
          </IconButton>
        </Tooltip>
      </div>

      <List className="MuiList-root">
        <ListItem
          button
          onClick={() => navigate('/home')}
          className="MuiListItem-root"
        >
          <HomeIcon className="MuiListItem-icon" />
          <ListItemText primary="Home" className="MuiListItemText-primary" />
        </ListItem>

        {/* Análises Submenu */}
        <ListItem
          button
          onClick={() => handleSubmenuClick('analises')}
          className="MuiListItem-root"
        >
          <AssessmentIcon className="MuiListItem-icon" />
          <ListItemText
            primary="Análises"
            className="MuiListItemText-primary"
          />
          {submenuState.analises ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={submenuState.analises} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              onClick={() => navigate('/profile/overview')}
              className="MuiListItem-root MuiListItem-child"
            >
              <ListItemIcon className="MuiListItemIcon-dot">
                <DotIcon style={{ fontSize: 8 }} className="DotIcon" />{' '}
                {/* Set smaller size here */}
              </ListItemIcon>
              <ListItemText
                primary="Precificação"
                className="MuiListItemText-primary"
              />
            </ListItem>
            <ListItem
              button
              onClick={() => navigate('/profile/settings')}
              className="MuiListItem-root MuiListItem-child"
            >
              <ListItemIcon className="MuiListItemIcon-dot">
                <DotIcon style={{ fontSize: 8 }} className="DotIcon" />{' '}
                {/* Set smaller size here */}
              </ListItemIcon>
              <ListItemText
                primary="Reprecificação"
                className="MuiListItemText-primary"
              />
            </ListItem>
          </List>
        </Collapse>

        <ListItem
          button
          onClick={() => navigate('/tickets')}
          className="MuiListItem-root"
        >
          <SettingsIcon className="MuiListItem-icon" />
          <ListItemText
            primary="Demandas"
            className="MuiListItemText-primary"
          />
        </ListItem>

        {/* Gerenciamento Submenu */}
        <ListItem
          button
          onClick={() => handleSubmenuClick('gerenciamento')}
          className="MuiListItem-root"
        >
          <ManageAccountsIcon className="MuiListItem-icon" />
          <ListItemText
            primary="Gerenciamento"
            className="MuiListItemText-primary"
          />
          {submenuState.gerenciamento ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={submenuState.gerenciamento} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              onClick={() => navigate('/admin/users')}
              className="MuiListItem-root MuiListItem-child"
            >
              <ListItemIcon className="MuiListItemIcon-dot">
                <DotIcon style={{ fontSize: 8 }} className="DotIcon" />{' '}
                {/* Set smaller size here */}
              </ListItemIcon>
              <ListItemText
                primary="Usuários"
                className="MuiListItemText-primary"
              />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default Sidebar;
