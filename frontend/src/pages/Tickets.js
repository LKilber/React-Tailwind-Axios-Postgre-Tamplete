import React, { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import Skeleton from '@mui/material/Skeleton';
import '../styles/Tickets.css';
import PricingTicket from '../components/tickets/PricingTicket';
import PricingTicketCard from '../components/tickets/PricingTicketCard';
import {
  fetchTickets,
  fetchDemandTypes,
  addNewTicket,
} from '../services/ticketService';

const Tickets = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [demandTypes, setDemandTypes] = useState([]);
  const [selectedDemandType, setSelectedDemandType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    const loadData = async () => {
      try {
        const [ticketsData, demandTypesData] = await Promise.all([
          fetchTickets(token),
          fetchDemandTypes(token),
        ]);
        setTickets(ticketsData);
        setDemandTypes(demandTypesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  const addTicket = useCallback(async (ticket) => {
    const token = localStorage.getItem('access_token');
    try {
      const newTicket = await addNewTicket(ticket, token);
      setTickets((prevTickets) => [...prevTickets, newTicket]);
      closeModal();
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  }, []);

  return (
    <div className="tickets">
      <Button
        variant="contained"
        color="primary"
        onClick={openPopover}
        className="animated-button"
      >
        <AddIcon />
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
        <div className="tickets-header">
          <Typography variant="subtitle2">ID</Typography>
          <Typography variant="subtitle2">Criação</Typography>
          <Typography variant="subtitle2">Status</Typography>
          <Typography variant="subtitle2">Demanda</Typography>
          <Typography variant="subtitle2">Criado por</Typography>
          <Typography variant="subtitle2">Responsável Atual</Typography>
          <Typography variant="subtitle2">Duração</Typography>
          <Typography variant="subtitle2">Entrega</Typography>
        </div>
        {loading ? (
          Array.from(new Array(5)).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={40}
            />
          ))
        ) : tickets.length > 0 ? (
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
