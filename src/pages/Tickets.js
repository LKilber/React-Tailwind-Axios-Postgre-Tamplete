import React, { useState, useEffect } from 'react';
import TicketModal from '../components/TicketModal';
import '../styles/Tickets.css';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const fetchedTickets = await new Promise((resolve) =>
        setTimeout(() => {
          resolve([
            { id: 1, title: 'Ticket 1', description: 'Descrição do Ticket 1' },
            { id: 2, title: 'Ticket 2', description: 'Descrição do Ticket 2' },
          ]);
        }, 2000),
      );
      setTickets(fetchedTickets);
      setLoading(false);
    };

    fetchTickets();
  }, []);

  const handleAddTicket = () => {
    const newId = tickets.length ? tickets[tickets.length - 1].id + 1 : 1;
    const ticket = { id: newId, ...newTicket };
    setTickets([...tickets, ticket]);
    setNewTicket({ title: '', description: '' });
    setModalIsOpen(false);
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  if (loading) {
    return <div className="tickets__loading">Carregando tickets...</div>;
  }

  return (
    <div className="tickets">
      <h1>Tickets</h1>
      <ul className="tickets__list">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="tickets__item">
            <h2>{ticket.title}</h2>
            <p>{ticket.description}</p>
          </li>
        ))}
      </ul>
      <button onClick={openModal}>Adicionar Ticket</button>
      <TicketModal isOpen={modalIsOpen} onClose={closeModal} />
    </div>
  );
};

export default Tickets;
