import React from 'react';
import { Container, Typography, Button, ButtonGroup } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (

    <Container align='center'>
      <Typography variant="h2" align='center' gutterBottom style={{ margin: '100px 0 0 0' }}>
        Ласкаво просимо!
      </Typography>

      <Typography variant="h3" align='center' gutterBottom style={{ margin: '50px 0 0 0' }}>
        Оберіть розділ:
      </Typography>

      <ButtonGroup variant="contained" size="large" style={{ marginTop: '20px' }} aria-label="Large button group">
        <Button variant="contained" component={Link} to="/products">
          Товари
        </Button>
        <Button variant="contained" component={Link} to="/categories">
          Категорії
        </Button>
        <Button variant="contained" component={Link} to="/users">
          Користувачі
        </Button>
      </ButtonGroup>
    </Container>
  );
}

export default Home;
