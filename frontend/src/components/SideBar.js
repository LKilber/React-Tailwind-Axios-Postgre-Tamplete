import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  CssBaseline,
} from '@mui/material';
import {
  Home,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  ChevronRight,
  ChevronLeft,
  ExpandLess,
  ExpandMore,
  Assignment,
} from '@mui/icons-material';
import { styled } from '@mui/system';

const drawerWidth = 240;
const miniDrawerWidth = 32;

const SidebarContainer = styled(Box)({
  display: 'flex',
  zIndex: 900, // Add this line to set the z-index of the Sidebar
});

const MiniDrawer = styled(Drawer)({
  width: miniDrawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: miniDrawerWidth,
    overflowX: 'hidden',
    transition: 'width 0.5s, background-color 0.5s', // Smooth width transition
    overflow: 'visible', // Ensure overflow is visible
    backgroundColor: '#fff', // Altera a cor de fundo da sidebar
  },
  '&:hover .MuiDrawer-paper': {
    width: drawerWidth,
    transition: 'width 0.5s, background-color 0.5s', // Smooth width transition
  },
  position: 'relative', // Enable positioning for the circle
});

const CircleWithArrow = styled(Box)({
  width: '24px', // Circle size
  height: '24px',
  borderRadius: '50%',
  backgroundColor: 'white',
  border: '1px solid #ccc', // Border color of the circle
  display: 'flex',
  position: 'absolute',
  left: '100%', // Position the circle outside the drawer
  top: '15%', // Adjust this value to move the circle upwards
  transform: 'translate(-50%, -50%)', // Centering the circle horizontally
  zIndex: 900, // Ensure it appears above other elements
  alignItems: 'center', // Center the arrow inside the circle
  justifyContent: 'center', // Center the arrow inside the circle
});

const ListItemWithTransition = styled(ListItem)({
  transition: 'padding 0.3s, color 0.3s', // Smooth item transition
});

const ListItemTextWithTransition = styled(ListItemText)({
  transition: 'opacity 0.3s', // Smooth text transition
  opacity: 1, // Default opacity for visible text
});

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAnalysis, setOpenAnalysis] = useState(false);
  const [openManagement, setOpenManagement] = useState(false);
  const navigate = useNavigate();

  return (
    <SidebarContainer>
      <CssBaseline />
      <MiniDrawer
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': {
            width: isOpen ? drawerWidth : miniDrawerWidth,
          },
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => {
          setIsOpen(false);
          setOpenAnalysis(false);
          setOpenManagement(false);
        }}
      >
        <CircleWithArrow>
          {isOpen ? (
            <ChevronLeft fontSize="small" />
          ) : (
            <ChevronRight fontSize="small" />
          )}
        </CircleWithArrow>
        {isOpen ? (
          <List sx={{ marginTop: 10 }}>
            <ListItemWithTransition
              button
              key="Home"
              onClick={() => navigate('/home')} // Wrap navigate call in an arrow function
            >
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemTextWithTransition primary="Home" />
            </ListItemWithTransition>

            <ListItemWithTransition
              button
              key="Demandas"
              onClick={() => navigate('/tickets')} // Wrap navigate call in an arrow function
            >
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemTextWithTransition primary="Demandas" />
            </ListItemWithTransition>

            <ListItemWithTransition
              button
              onMouseEnter={() => setOpenAnalysis(true)}
              onMouseLeave={() => setOpenAnalysis(false)}
            >
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemTextWithTransition primary="Análises" />
              {openAnalysis ? <ExpandLess /> : <ExpandMore />}
            </ListItemWithTransition>
            <Collapse in={openAnalysis} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                onMouseEnter={() => setOpenAnalysis(true)} // Keep open on hover
                onMouseLeave={() => setOpenAnalysis(false)} // Close when leaving
              >
                <ListItemWithTransition button sx={{ pl: 4 }}>
                  <ListItemTextWithTransition primary="Precificação" />
                </ListItemWithTransition>
                <ListItemWithTransition button sx={{ pl: 4 }}>
                  <ListItemTextWithTransition primary="Reprecificação" />
                </ListItemWithTransition>
              </List>
            </Collapse>
            <ListItemWithTransition
              button
              onMouseEnter={() => setOpenManagement(true)}
              onMouseLeave={() => setOpenManagement(false)}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemTextWithTransition primary="Gerenciamento" />
              {openManagement ? <ExpandLess /> : <ExpandMore />}
            </ListItemWithTransition>
            <Collapse in={openManagement} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                onMouseEnter={() => setOpenManagement(true)} // Keep open on hover
                onMouseLeave={() => setOpenManagement(false)} // Close when leaving
              >
                <ListItemWithTransition
                  button
                  sx={{ pl: 4 }}
                  onClick={() => navigate('/admin/users')}
                >
                  <ListItemTextWithTransition primary="Usuários" />
                </ListItemWithTransition>
                <ListItemWithTransition button sx={{ pl: 4 }}>
                  <ListItemTextWithTransition primary="Sistema" />
                </ListItemWithTransition>
              </List>
            </Collapse>
          </List>
        ) : null}
      </MiniDrawer>
    </SidebarContainer>
  );
};

export default Sidebar;
