import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Box, Toolbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from '../api/axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('');



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Помилка під час отримання користувачів:', error);
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
      console.error('Помилка під час додавання користувача:', error);
    }
  };

  const handleEditUserClick = (user) => {
    setSelectedUser(user);
    setEditUsername(user.username);
    setEditPassword('');
    setEditRole(user.role);
    setEditDialogOpen(true);
  };

  const handleEditUser = async () => {
    try {
      const response = await axios.put(
        `/users/${selectedUser.id}`,
        { username: editUsername, password: editPassword, role: editRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setUsers(users.map((user) => (user.id === selectedUser.id ? response.data : user)));
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Помилка під час оновлення користувача:', error);
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
      console.error('Помилка під час видалення користувача:', error);
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
      <Typography variant="h4" gutterBottom style={{ margin: '100px 0 0 0' }}>
        Управління користувачами
      </Typography>

      <TextField
        label="Пошук користувачів"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
        style={{ marginTop: '40px' }}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ім'я користувача</TableCell>
            <TableCell>Роль</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" onClick={() => handleEditUserClick(user)}>
                  Редагувати
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(user.id)} style={{ marginLeft: '10px' }}>
                  Видалити
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ flexGrow: 1 }} style={{ marginTop: '50px' }}>
        <Toolbar style={{ padding: '0px' }}>
          <Typography component="div" sx={{ flexGrow: 1 }} variant="h4" gutterBottom>
            Додавання користувачів
          </Typography>

          <Button variant="contained" color="primary" onClick={handleAddUser}>
            Додати користувача
          </Button>
        </Toolbar>
      </Box>

      <form>
        <TextField
          label="Ім'я користувача"
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

      </form>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Редактирование пользователя</DialogTitle>
        <DialogContent>
          <TextField
            label="Имя пользователя"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Пароль (оставьте пустым, если не хотите менять)"
            type="password"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Роль"
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleEditUser} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

export default Users;
