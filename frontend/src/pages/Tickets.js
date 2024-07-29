import React, { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import AddIcon from '@mui/icons-material/Add';
import Skeleton from '@mui/material/Skeleton';
import { format, parseISO } from 'date-fns';
import '../styles/Tickets.css';
import PricingTicket from '../components/tickets/PricingTicket';
import TicketDetailModal from '../components/tickets/TicketDetailModal';
import { fetchTickets, fetchDemandTypes } from '../services/ticketService';

import { Typography, Chip, Pagination } from '@mui/material';

const getStatusColor = (status) => {
  switch (status) {
    case 'Aberto':
      return 'primary';
    case 'Fechado':
      return 'default';
    case 'Em Progresso':
      return 'secondary';
    default:
      return 'default';
  }
};

const getSectorColor = (sector) => {
  switch (sector) {
    case 'Preço&Risco':
      return 'success';
    case 'Outro Setor':
      return 'warning';
    default:
      return 'default';
  }
};

const Tickets = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [demandTypes, setDemandTypes] = useState([]);
  const [selectedDemandType, setSelectedDemandType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetailModalIsOpen, setTicketDetailModalIsOpen] = useState(false);
  const [ticketUpdated, setTicketUpdated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadData = async () => {
    const token = localStorage.getItem('access_token');
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

  useEffect(() => {
    loadData();
  }, [ticketUpdated]);

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

  const openTicketDetailModal = (ticket) => {
    console.log(selectedTicket);
    setSelectedTicket(ticket);
    setTicketDetailModalIsOpen(true);
  };

  const closeTicketDetailModal = () => {
    setTicketDetailModalIsOpen(false);
    setSelectedTicket(null);
  };

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      console.error('Invalid date format:', dateString);
      return 'Invalid date';
    }
  };

  const addTicket = useCallback((newTicket) => {
    setTickets((prevTickets) => [...prevTickets, newTicket]);
    closeModal();
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const displayedTickets = tickets
    .slice()
    .reverse()
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        ) : displayedTickets.length > 0 ? (
          displayedTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => openTicketDetailModal(ticket)}
              className="ticket-row-link"
              style={{ cursor: 'pointer' }}
            >
              <div className="ticket-row">
                <Typography variant="body2" className="ticket-column">
                  {ticket.id}
                </Typography>
                <Typography variant="body2" className="ticket-column">
                  {formatDate(ticket.created_at)}
                </Typography>
                <Chip
                  className="ticket-column"
                  label={ticket.status}
                  color={getStatusColor(ticket.status)}
                />
                <Typography variant="body2" className="ticket-column">
                  {ticket.demand_type}
                </Typography>
                <Typography variant="body2" className="ticket-column">
                  {ticket.created_by}
                </Typography>
                <Chip
                  className="ticket-column"
                  label={ticket.responsible_sector}
                  color={getSectorColor(ticket.responsible_sector)}
                />
                <Typography variant="body2" className="ticket-column">
                  {ticket.duration}
                </Typography>
                <Typography variant="body2" className="ticket-column">
                  {ticket.due_date}
                </Typography>
              </div>
            </div>
          ))
        ) : (
          <Typography variant="body2">No tickets available</Typography>
        )}
      </div>

      <Pagination
        count={Math.ceil(tickets.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />

      <PricingTicket
        show={modalIsOpen}
        handleClose={closeModal}
        onSubmit={addTicket}
        demandType={selectedDemandType}
      />

      {selectedTicket && (
        <TicketDetailModal
          open={ticketDetailModalIsOpen}
          onClose={closeTicketDetailModal}
          selectedTicket={selectedTicket}
          onUpdate={() => setTicketUpdated((prev) => !prev)}
        />
      )}
    </div>
  );
};

export default Tickets;
