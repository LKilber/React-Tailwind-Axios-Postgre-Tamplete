import React, { useState, useEffect } from 'react';
import '../styles/Tickets.css';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

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
    </div>
  );
};

export default Tickets;
