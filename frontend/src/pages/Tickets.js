import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import '../styles/Tickets.css';
import PricingTicket from '../components/tickets/PricingTicket';
import PricingTicketCard from '../components/tickets/PricingTicketCard';

const Tickets = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [demandTypes, setDemandTypes] = useState([]);
  const [selectedDemandType, setSelectedDemandType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          'http://192.168.19.128:8000/demand/demands/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setTickets(response.data || []); // Ensure response data is always an array
        console.log('Fetched tickets:', response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    const fetchDemandTypes = async () => {
      try {
        const response = await axios.get(
          'http://192.168.19.128:8000/demand/demand-types/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setDemandTypes(response.data || []); // Ensure response data is always an array
      } catch (error) {
        console.error('Error fetching demand types:', error);
      }
    };

    fetchTickets();
    fetchDemandTypes();
  }, []);

  const openPopover = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setPopoverAnchorEl(null);
  };

  const openModal = (demandType) => {
    setSelectedDemandType(demandType);
    setModalIsOpen(true);
    closePopover();
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const addTicket = async (ticket) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        'http://192.168.19.128:8000/demand/demands/',
        ticket,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTickets([...tickets, response.data] || []);
      closeModal();
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  };

  return (
    <div className="tickets">
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={openPopover}
        style={{
          marginBottom: '20px',
          backgroundColor: '#6200ea',
          borderRadius: '50px',
          padding: '10px 20px',
          transition: 'background-color 0.3s ease',
        }}
        className="animated-button"
      >
        Nova Demanda
      </Button>
      <Popover
        open={Boolean(popoverAnchorEl)}
        anchorEl={popoverAnchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        className="custom-popover"
      >
        <div className="popover-content">
          {demandTypes.map((demandType) => (
            <Typography
              key={demandType.id}
              onClick={() => openModal(demandType)}
              className="popover-item"
            >
              {demandType.name}
            </Typography>
          ))}
        </div>
      </Popover>
      <div className="tickets-list">
        {Array.isArray(tickets) && tickets.length > 0 ? (
          tickets.map((ticket) => (
            <PricingTicketCard key={ticket.id} ticket={ticket} />
          ))
        ) : (
          <Typography variant="body2">No tickets available</Typography>
        )}
      </div>

      <PricingTicket
        show={modalIsOpen}
        handleClose={closeModal}
        onSubmit={addTicket}
        demandType={selectedDemandType}
      />
    </div>
  );
};

export default Tickets;
