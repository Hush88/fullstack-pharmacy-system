import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Система управления аптечным складом
                    </Typography>
                    <Button color="button" variant="contained" style={{ margin: '0 5px 0 5px' }} component={Link} to="/">
                        Главная
                    </Button>
                    <Button color="button" variant="contained" style={{ margin: '0 5px 0 5px' }} component={Link} to="/products">
                        Товары
                    </Button>
                    <Button color="button" variant="contained" style={{ margin: '0 5px 0 5px' }} component={Link} to="/categories">
                        Категории
                    </Button>
                    <Button color="button" variant="contained" style={{ margin: '0 5px 0 5px' }} component={Link} to="/users">
                        Пользователи
                    </Button>
                    <Button color="button" variant="contained" style={{ margin: '0 5px 0 5px' }} component={Link} to="/login">
                        Вход
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NavBar;