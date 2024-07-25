// src/hooks/useTicketDetails.js

import { useState, useEffect } from 'react';
import { fetchTicketDetails, fetchComments } from '../services/apiService';

export const useTicketDetails = (id) => {
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ticketData = await fetchTicketDetails(id);
        setTicket(ticketData);
        const commentsData = await fetchComments(id);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { ticket, comments, loading, setTicket, setComments };
};
