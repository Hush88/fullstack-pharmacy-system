import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      console.error('Ошибка при входе в систему:', error);
      alert('Неправильные учетные данные');
    }
  };

  return (
    <Container maxWidth="xs">

      <Typography variant="h4" align="center" gutterBottom style={{ margin: '100px 0 0 0' }}>
        Вход в систему
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Имя пользователя"
          fullWidth
          margin="normal"
          style={{ marginTop: '20px' }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Пароль"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '15px' }} fullWidth>
          Войти
        </Button>
      </form>
    </Container>
  );
}

export default Login;
