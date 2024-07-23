import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Tickets.css';
import PricingTicket from '../components/tickets/PricingTicket';
import PricingTicketCard from '../components/tickets/PricingTicketCard';

const Tickets = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          'http://192.168.19.128:8000/demand/pricing-tickets/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const addTicket = async (ticket) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        'http://192.168.19.128/demand/pricing-tickets/',
        ticket,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTickets([...tickets, response.data]);
      closeModal();
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  };

  return (
    <div className="tickets">
      <h1>Tickets</h1>
      <button onClick={openModal}>Add New Ticket</button>
      <div className="tickets-list">
        {tickets.map((ticket) => (
          <PricingTicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>

      <PricingTicket
        show={modalIsOpen}
        handleClose={closeModal}
        onSubmit={addTicket}
      />
    </div>
  );
};

export default Tickets;
