import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Toolbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from '@mui/material';
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
      setUsers((prevUsers) => [...prevUsers, response.data]);
      setFilteredUsers((prevUsers) => [...prevUsers, response.data]);
      handleSnackbarOpen('Користувач успішно доданий!');
    } catch (error) {
      console.error('Помилка під час додавання користувача:', error);
      handleSnackbarOpen('Помилка під час додавання користувача.');
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
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? response.data : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? response.data : user
        )
      );
      setEditDialogOpen(false);
      handleSnackbarOpen('Користувача успішно оновлено!');
    } catch (error) {
      console.error('Помилка під час оновлення користувача:', error);
      handleSnackbarOpen('Помилка під час оновлення користувача.');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== id)
      );
      handleSnackbarOpen('Користувача успішно видалено!');
    } catch (error) {
      console.error('Помилка під час видалення користувача:', error);
      handleSnackbarOpen('Помилка під час видалення користувача.');
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

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditUserClick(user)}
                >
                  Редагувати
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteUser(user.id)}
                  style={{ marginLeft: '10px' }}
                >
                  Видалити
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ flexGrow: 1 }} style={{ marginTop: '50px' }}>
        <Toolbar style={{ padding: '0px' }}>
          <Typography
            component="div"
            sx={{ flexGrow: 1 }}
            variant="h4"
            gutterBottom
          >
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
          name="name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Пароль"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Роль"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          margin="normal"
        />
      </form>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Редагування користувача</DialogTitle>
        <DialogContent>
          <TextField
            label="Ім'я користувача"
            name="new_name"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Пароль (залиште порожнім, якщо не хочете змінювати)"
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
            Скасувати
          </Button>
          <Button onClick={handleEditUser} color="primary">
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
}

export default Users;
