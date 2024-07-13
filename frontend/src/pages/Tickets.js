// pages/Tickets.js
import React, { useState } from 'react';
import '../styles/Tickets.css';

const Tickets = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ title: '', sector: '' });

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  const addTicket = () => {
    setTickets([
      ...tickets,
      { ...newTicket, id: tickets.length + 1, createdAt: new Date() },
    ]);
    setNewTicket({ title: '', sector: '' });
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
            {ticket.title} - {ticket.sector} - SLA:{' '}
            {calculateSLA(ticket.createdAt)} days
          </li>
        ))}
      </ul>

      {modalIsOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Ticket</h2>
            <form>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={newTicket.title}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Sector:
                <input
                  type="text"
                  name="sector"
                  value={newTicket.sector}
                  onChange={handleInputChange}
                />
              </label>
              <button type="button" onClick={addTicket}>
                Add Ticket
              </button>
            </form>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
