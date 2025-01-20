import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container } from '@mui/material';

const Booking = () => {
  const [room, setRoom] = useState('');
  const [date, setDate] = useState('');

  const handleBooking = (e) => {
    e.preventDefault();
    console.log('Booking Room:', room, 'on Date:', date);
    alert('Room booked successfully!');
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Book a Room
      </Typography>
      <form onSubmit={handleBooking}>
        <TextField
          label="Room Number"
          fullWidth
          margin="normal"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <TextField
          label="Booking Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Book Room
        </Button>
      </form>
    </Container>
  );
};

export default Booking;
