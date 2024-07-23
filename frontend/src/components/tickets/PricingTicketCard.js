import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const PricingTicketCard = ({ ticket }) => {
  return (
    <Card
      component={Link}
      to={`/tickets/${ticket.id}`}
      sx={{ maxWidth: 600, margin: '20px auto', textDecoration: 'none' }}
    >
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
              </Grid>
              <Grid item xs={6}>
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
            </Grid>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

PricingTicketCard.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.number.isRequired,
    group: PropTypes.string.isRequired,
    selected_group: PropTypes.string.isRequired,
    unit_quantity: PropTypes.number.isRequired,
    pricing_type: PropTypes.string.isRequired,
    units: PropTypes.arrayOf(
      PropTypes.shape({
        cnpj: PropTypes.string.isRequired,
        fantasy_name: PropTypes.string.isRequired,
        social_reason: PropTypes.string.isRequired,
        inep_code: PropTypes.string.isRequired,
        cep: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default PricingTicketCard;
