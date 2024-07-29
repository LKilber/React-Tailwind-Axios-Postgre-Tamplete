import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import { useTicketDetails } from '../../hooks/useTicketDetails';
import {
  Typography,
  Box,
  Paper,
  Divider,
  Avatar,
  IconButton,
  TextField,
  MenuItem,
  Select,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { deepPurple } from '@mui/material/colors';
import { styled } from '@mui/system';
import {
  addComment,
  updateTicketStatus,
  updateResponsibleSector,
} from '../../services/apiService';
import { fetchTicketById } from '../../services/ticketService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700, // Largura fixa
  height: '95vh', // Altura fixa
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '12px',
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
};

const StyledSelect = styled(Select)({
  borderRadius: '12px',
  minWidth: '100px',
  '& .MuiSelect-select': {
    padding: '3px 16px',
    border: 'none',
    fontSize: '0.7rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:focus .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSelect-icon': {
    color: '#fff',
  },
  backgroundColor: '#3f51b5',
  color: '#fff',
});

const StyledMenuItem = styled(MenuItem)({
  fontSize: '0.7rem',
  padding: '4px 8px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
  },
});

const CommentsContainer = styled(Box)({
  overflowY: 'auto',
  paddingRight: '16px',
  marginBottom: '16px',
});

const TicketDetailModal = ({ open, onClose, selectedTicket, onUpdate }) => {
  const selectedTicketId = selectedTicket.id;
  const { ticket, comments, setTicket, setComments } =
    useTicketDetails(selectedTicketId);
  const [commentText, setCommentText] = useState('');
  const [status, setStatus] = useState('');
  const [responsibleSector, setResponsibleSector] = useState('');

  useEffect(() => {
    if (selectedTicketId) {
      const fetchTicket = async () => {
        try {
          const token = localStorage.getItem('access_token');
          const fetchedTicket = await fetchTicketById(selectedTicketId, token);
          setStatus(fetchedTicket.status || '');
          setResponsibleSector(fetchedTicket.responsible_sector || '');
        } catch (error) {
          console.error('Error fetching ticket:', error);
        }
      };
      fetchTicket();
    }
  }, [selectedTicketId]);

  const handleCommentSubmit = async () => {
    const username = JSON.parse(localStorage.getItem('user')).username;
    try {
      const newComment = await addComment({
        ticket: selectedTicketId,
        user: username,
        text: commentText,
      });
      setComments((prevComments) => [...prevComments, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicketStatus(selectedTicketId, newStatus);
      setTicket((prevTicket) => ({ ...prevTicket, status: newStatus }));
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleResponsibleSectorChange = async (newSector) => {
    try {
      await updateResponsibleSector(selectedTicketId, newSector);
      setTicket((prevTicket) => ({
        ...prevTicket,
        responsible_sector: newSector,
      }));
      onUpdate();
    } catch (error) {
      console.error('Error updating responsible sector:', error);
    }
  };

  if (!ticket) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="h5" component="div">
            Ticket ID: {ticket.id}
          </Typography>
          <Box display="flex" gap={1}>
            <StyledSelect
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                handleStatusChange(e.target.value);
              }}
            >
              <StyledMenuItem value="Aberto">Aberto</StyledMenuItem>
              <StyledMenuItem value="Fechado">Fechado</StyledMenuItem>
              <StyledMenuItem value="Em Progresso">Em Progresso</StyledMenuItem>
            </StyledSelect>

            <StyledSelect
              value={responsibleSector}
              onChange={(e) => {
                setResponsibleSector(e.target.value);
                handleResponsibleSectorChange(e.target.value);
              }}
            >
              <StyledMenuItem value="Preço&Risco">Preço&Risco</StyledMenuItem>
              <StyledMenuItem value="Outro Setor">Outro Setor</StyledMenuItem>
            </StyledSelect>
          </Box>
        </Box>
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            Group: {ticket.group}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Selected Group: {ticket.selected_group}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unit Quantity: {ticket.unit_quantity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pricing Type: {ticket.pricing_type}
          </Typography>
        </Box>
        <Typography variant="h6" component="div" mb={1}>
          Anexos:
        </Typography>
        <Typography variant="h6" component="div" mb={1}>
          Comentários:
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <CommentsContainer>
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment) => (
              <Paper
                key={comment.id}
                sx={{ p: 1, mb: 1, backgroundColor: deepPurple[50] }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar sx={{ bgcolor: deepPurple[500], mr: 1 }}>
                    {comment.user.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="subtitle2">{comment.user}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    {new Date(comment.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2">{comment.text}</Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhum comentário disponível.
            </Typography>
          )}
        </CommentsContainer>
        <Box mt="auto" display="flex" alignItems="center">
          <StyledTextField
            label="Adicionar um comentário..."
            multiline
            fullWidth
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <IconButton color="primary" onClick={handleCommentSubmit}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

TicketDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedTicket: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default TicketDetailModal;
