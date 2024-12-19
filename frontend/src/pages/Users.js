import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from '../api/axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data); // Отображение всех пользователей
      } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
      }
    };
    fetchUsers();
  }, []);


  const handleAddUser = async () => {
    try {
      const response = await axios.post(
        '/users',
        { username, password, role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setUsers([...users, response.data]);
    } catch (error) {
      console.error('Ошибка при добавлении пользователя:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Управление пользователями
      </Typography>

      <TextField
        label="Поиск пользователей"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Имя пользователя</TableCell>
            <TableCell>Роль</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(user.id)}>
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="h4" gutterBottom>
        Добавление пользователей
      </Typography>

      <form>
        <TextField
          label="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Роль"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleAddUser}>
          Добавить пользователя
        </Button>
      </form>
    </Container>
  );
}

export default Users;
