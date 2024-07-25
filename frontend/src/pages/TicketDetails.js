// src/components/TicketDetail.js

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Link,
  TextField,
  Avatar,
  Paper,
  IconButton,
  Divider,
  MenuItem,
  Select,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { deepPurple } from '@mui/material/colors';
import { styled } from '@mui/system';
import { useTicketDetails } from '../hooks/useTicketDetails';
import {
  addComment,
  updateTicketStatus,
  updateResponsibleSector,
} from '../services/apiService';

const StyledSelect = styled(Select)({
  borderRadius: '12px',
  minWidth: '150px',
  '& .MuiSelect-select': {
    padding: '8px 16px',
    border: 'none',
    fontSize: '0.875rem',
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

const TicketDetail = () => {
  const { id } = useParams();
  const { ticket, comments, loading, setTicket, setComments } =
    useTicketDetails(id);
  const [commentText, setCommentText] = useState('');
  const [status, setStatus] = useState(ticket?.status || '');
  const [responsibleSector, setResponsibleSector] = useState(
    ticket?.responsible_sector || '',
  );

  const handleCommentSubmit = async () => {
    const username = JSON.parse(localStorage.getItem('user')).username;
    try {
      const newComment = await addComment({
        ticket: id,
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
      await updateTicketStatus(id, newStatus);
      setTicket((prevTicket) => ({ ...prevTicket, status: newStatus }));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleResponsibleSectorChange = async (newSector) => {
    try {
      await updateResponsibleSector(id, newSector);
      setTicket((prevTicket) => ({
        ...prevTicket,
        responsible_sector: newSector,
      }));
    } catch (error) {
      console.error('Error updating responsible sector:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!ticket) {
    return <div>No ticket data found</div>;
  }

  return (
    <Card
      sx={{
        maxWidth: 800,
        margin: '20px auto',
        padding: '20px',
        position: 'relative',
      }}
    >
      <CardContent>
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 2,
          }}
        >
          <StyledSelect
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              handleStatusChange(e.target.value);
            }}
          >
            <MenuItem value="Aberto">Aberto</MenuItem>
            <MenuItem value="Fechado">Fechado</MenuItem>
            <MenuItem value="Em Progresso">Em Progresso</MenuItem>
          </StyledSelect>

          <StyledSelect
            value={responsibleSector}
            onChange={(e) => {
              setResponsibleSector(e.target.value);
              handleResponsibleSectorChange(e.target.value);
            }}
          >
            <MenuItem value="Preço&Risco">Preço&Risco</MenuItem>
            <MenuItem value="Outro Setor">Outro Setor</MenuItem>
          </StyledSelect>
        </Box>

        <Typography variant="h5" component="div">
          Ticket ID: {ticket.id}
        </Typography>
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

        <Box mt={2}>
          <Typography variant="h6" component="div">
            Units:
          </Typography>
          {ticket.units?.map((unit, index) => (
            <Grid container spacing={2} key={index} mt={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>CNPJ:</strong> {unit.cnpj}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Fantasy Name:</strong> {unit.fantasy_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Social Reason:</strong> {unit.social_reason}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>INEP Code:</strong> {unit.inep_code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>CEP:</strong> {unit.cep}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Address:</strong> {unit.address}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Data Attachments:</strong>
                  </Typography>
                  {unit.data_attachments?.map((attachment) => (
                    <Typography
                      key={attachment.id}
                      variant="body2"
                      color="text.secondary"
                    >
                      <Link
                        href={attachment.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {attachment.file}
                      </Link>
                    </Typography>
                  ))}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Contract Attachments:</strong>
                  </Typography>
                  {unit.contract_attachment?.map((attachment) => (
                    <Typography
                      key={attachment.id}
                      variant="body2"
                      color="text.secondary"
                    >
                      <Link
                        href={attachment.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {attachment.file}
                      </Link>
                    </Typography>
                  ))}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>School Structure Attachments:</strong>
                  </Typography>
                  {unit.school_structure_attachments?.map((attachment) => (
                    <Typography
                      key={attachment.id}
                      variant="body2"
                      color="text.secondary"
                    >
                      <Link
                        href={attachment.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {attachment.file}
                      </Link>
                    </Typography>
                  ))}
                </Box>
              </Grid>
            </Grid>
          ))}
        </Box>

        <Box mt={2}>
          <Typography variant="h6" component="div">
            Comentários:
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment) => (
              <Paper
                key={comment.id}
                sx={{ p: 2, mb: 1, backgroundColor: deepPurple[50] }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar sx={{ bgcolor: deepPurple[500], mr: 2 }}>
                    {comment.user.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="subtitle2">{comment.user}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 2 }}
                  >
                    {new Date(comment.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2">{comment.text}</Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No comments available.
            </Typography>
          )}
        </Box>

        <Box mt={2} display="flex" alignItems="center">
          <TextField
            label="Adicionar um comentário..."
            multiline
            fullWidth
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            variant="outlined"
            sx={{ mr: 2 }}
          />
          <IconButton color="primary" onClick={handleCommentSubmit}>
            <SendIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TicketDetail;
