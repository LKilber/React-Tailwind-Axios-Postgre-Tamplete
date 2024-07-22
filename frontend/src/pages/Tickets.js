import React, { useState } from 'react';
import '../styles/Tickets.css';
import PricingTicket from '../components/tickets/PricingTicket';

const Tickets = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tickets, setTickets] = useState([]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const addTicket = (ticket) => {
    setTickets([
      ...tickets,
      { ...ticket, id: tickets.length + 1, createdAt: new Date() },
    ]);
    closeModal();
  };

  const calculateSLA = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diff = Math.ceil((now - created) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="tickets">
      <h1>Tickets</h1>
      <button onClick={openModal}>Add New Ticket</button>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            {ticket.cnpj} - {ticket.fantasyName} - SLA:{' '}
            {calculateSLA(ticket.createdAt)} days
          </li>
        ))}
      </ul>

      <PricingTicket
        show={modalIsOpen}
        handleClose={closeModal}
        onSubmit={addTicket}
      />
    </div>
  );
};

export default Tickets;
