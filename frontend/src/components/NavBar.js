import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Система управління аптечним складом
          </Typography>
          <Button
            color="button"
            variant="contained"
            style={{ margin: '0 5px 0 5px' }}
            component={Link}
            to="/"
          >
            Головна
          </Button>
          <Button
            color="button"
            variant="contained"
            style={{ margin: '0 5px 0 5px' }}
            component={Link}
            to="/products"
          >
            Товари
          </Button>
          <Button
            color="button"
            variant="contained"
            style={{ margin: '0 5px 0 5px' }}
            component={Link}
            to="/categories"
          >
            Категорії
          </Button>
          <Button
            color="button"
            variant="contained"
            style={{ margin: '0 5px 0 5px' }}
            component={Link}
            to="/users"
          >
            Користувачі
          </Button>
          <Button
            color="button"
            variant="contained"
            style={{ margin: '0 5px 0 5px' }}
            component={Link}
            to="/login"
          >
            Вхід
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;
