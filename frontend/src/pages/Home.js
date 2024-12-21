import React from 'react';
import { Container, Typography, Button, ButtonGroup } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (

    <Container align='center'>
      <Typography variant="h2" align='center' gutterBottom style={{ margin: '100px 0 0 0' }}>
        Добро пожаловать!
      </Typography>

      <Typography variant="h3" align='center' gutterBottom style={{ margin: '50px 0 0 0' }}>
        Выберите раздел:
      </Typography>

      <ButtonGroup variant="contained" size="large" style={{ marginTop: '20px' }} aria-label="Large button group">
        <Button variant="contained" component={Link} to="/products">
          Товары
        </Button>
        <Button variant="contained" component={Link} to="/categories">
          Категории
        </Button>
        <Button variant="contained" component={Link} to="/users">
          Пользователи
        </Button>
      </ButtonGroup>
    </Container>
  );
}

export default Home;
