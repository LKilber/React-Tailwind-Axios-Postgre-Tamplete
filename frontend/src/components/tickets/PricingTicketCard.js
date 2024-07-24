import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

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

const PricingTicketCard = ({ ticket }) => {
  return (
    <Card
      component={Link}
      to={`/tickets/${ticket.id}`}
      sx={{
        margin: '20px auto',
        textDecoration: 'none',
        backgroundColor: 'white',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        '&:hover': {
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
        },
        display: 'block',
        position: 'relative',
        width: '100%', // Adicionado para garantir que ocupe toda a largura do contêiner pai
      }}
    >
      <CardContent>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              Created At: {new Date(ticket.created_at).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              Created By: {ticket.created_by}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              Demand Type: {ticket.demand_type}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              Responsible: {ticket.responsible || 'Not Assigned'}
            </Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 1,
          }}
        >
          <Chip label={ticket.status} color={getStatusColor(ticket.status)} />
          <Chip
            label={ticket.responsible_sector}
            color={getSectorColor(ticket.responsible_sector)}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

PricingTicketCard.propTypes = {
  ticket: PropTypes.shape({
    created_at: PropTypes.string.isRequired,
    created_by: PropTypes.string.isRequired,
    demand_type: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    responsible: PropTypes.string,
    responsible_sector: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default PricingTicketCard;
