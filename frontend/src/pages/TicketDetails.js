import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { deepPurple } from '@mui/material/colors';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const fetchTicket = async () => {
      try {
        const response = await axios.get(
          `http://192.168.19.128:8000/demand/pricing-tickets/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setTicket(response.data);

        const commentsResponse = await axios.get(
          `http://192.168.19.128:8000/demand/comments/ticket_comments/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              ticket_id: id,
            },
          },
        );
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching ticket:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem('access_token');
    const username = JSON.parse(localStorage.getItem('user')).username;
    try {
      const response = await axios.post(
        `http://192.168.19.128:8000/demand/comments/`,
        {
          pricing_ticket: id,
          user: username,
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setComments([...comments, response.data]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!ticket) {
    return <div>No ticket data found</div>;
  }

  return (
    <Card sx={{ maxWidth: 800, margin: '20px auto', padding: '20px' }}>
      <CardContent>
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
          {ticket.units.map((unit, index) => (
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
                  {unit.data_attachments.map((attachment) => (
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
                  {unit.contract_attachment.map((attachment) => (
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
                  {unit.school_structure_attachments.map((attachment) => (
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
            Comments:
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {comments.map((comment) => (
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
          ))}
        </Box>

        <Box mt={2} display="flex" alignItems="center">
          <TextField
            label="Add a comment"
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
