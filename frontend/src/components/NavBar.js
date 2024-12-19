import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Система управления аптечным складом
                </Typography>
                <Button color="inherit" component={Link} to="/">
                    Главная
                </Button>
                <Button color="inherit" component={Link} to="/products">
                    Товары
                </Button>
                <Button color="inherit" component={Link} to="/categories">
                    Категории
                </Button>
                <Button color="inherit" component={Link} to="/users">
                    Пользователи
                </Button>
                <Button color="inherit" component={Link} to="/login">
                    Вход
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;