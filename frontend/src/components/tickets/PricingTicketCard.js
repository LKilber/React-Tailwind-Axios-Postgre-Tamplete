import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Grid, Chip } from '@mui/material';
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
    <Card component={Link} to={`/tickets/${ticket.id}`} className="ticket-card">
      <CardContent>
        <Grid
          container
          direction="row"
          spacing={2}
          alignItems="center"
          className="ticket-card-grid"
        >
          <Grid item xs>
            <Typography variant="body2" color="text.secondary">
              {ticket.id}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="body2" color="text.secondary">
              {new Date(ticket.created_at).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs>
            <Chip label={ticket.status} color={getStatusColor(ticket.status)} />
          </Grid>
          <Grid item xs>
            <Typography variant="body2" color="text.secondary">
              {ticket.demand_type}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="body2" color="text.secondary">
              {ticket.created_by}
            </Typography>
          </Grid>
          <Grid item xs>
            <Chip
              label={ticket.responsible_sector}
              color={getSectorColor(ticket.responsible_sector)}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="body2" color="text.secondary">
              {ticket.duration || 'Not Assigned'}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="body2" color="text.secondary">
              {ticket.due_date || 'Not Assigned'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

PricingTicketCard.propTypes = {
  ticket: PropTypes.shape({
    created_at: PropTypes.string.isRequired,
    created_by: PropTypes.string.isRequired,
    demand_type: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    responsible: PropTypes.string,
    responsible_sector: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    due_date: PropTypes.string.isRequired,
  }).isRequired,
};

export default PricingTicketCard;
