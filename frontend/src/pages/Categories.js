import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Box, Toolbar } from '@mui/material';
import axios from '../api/axios';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/categories', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setCategories(response.data);
                setFilteredCategories(response.data); // Отображение всех категорий
            } catch (error) {
                console.error('Помилка під час отримання категорій:', error);
            }
        };
        fetchCategories();
    }, []);


    const handleAddCategory = async () => {
        try {
            const response = await axios.post(
                '/categories',
                { name, description },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setCategories([...categories, response.data]);
            handleSnackbarOpen('Категорію успішно додано!');
        } catch (error) {
            console.error('Помилка під час додавання категорії:', error);
        }
    };

    const handleEditCategoryClick = (category) => {
        setSelectedCategory(category);
        setName(category.name);
        setDescription(category.description);
        setEditDialogOpen(true);
    };

    const handleEditCategory = async () => {
        try {
            const response = await axios.put(
                `/categories/${selectedCategory.id}`,
                { name, description },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setCategories(categories.map((c) => (c.id === selectedCategory.id ? response.data : c)));
            setEditDialogOpen(false);
            handleSnackbarOpen('Категорію успішно відредаговано!');
        } catch (error) {
            console.error('Помилка під час редагування категорії:', error);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await axios.delete(`/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCategories(categories.filter((category) => category.id !== id));
            handleSnackbarOpen('Категорію успішно видалено!');
        } catch (error) {
            console.error('Помилка під час видалення категорії:', error);
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = categories.filter(
            (category) =>
                category.name.toLowerCase().includes(query) ||
                category.description.toLowerCase().includes(query)
        );

        setFilteredCategories(filtered);
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
                Управління категоріями
            </Typography>

            <TextField
                label="Пошук категорій"
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                margin="normal"
                style={{ marginTop: '40px' }}
            />

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Назва</TableCell>
                        <TableCell style={{ maxWidth: 200 }}>Опис</TableCell>
                        <TableCell>Дії</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }} title={category.description}>
                                {category.description}
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={() => handleEditCategoryClick(category)}>
                                    Редагувати
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => handleDeleteCategory(category.id)} style={{ marginLeft: '10px' }}>
                                    Видалити
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>

            <Box sx={{ flexGrow: 1 }} style={{ marginTop: '50px' }}>
                <Toolbar style={{ padding: '0px' }}>
                    <Typography component="div" sx={{ flexGrow: 1 }} variant="h4" gutterBottom style={{ margin: '0' }}>
                        Додавання категорій
                    </Typography>

                    <Button variant="contained" color="primary" onClick={handleAddCategory}>
                        Додати категорію
                    </Button>
                </Toolbar>
            </Box>

            <form>
                <TextField
                    label="Назва категорії"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Опис категорії"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    style={{ marginBottom: '50px' }}
                />
            </form>

            {/* Модальное окно для редактирования категории */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Редагування категорії</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Будь ласка, внесіть зміни в ці категорії.
                    </DialogContentText>
                    <TextField
                        label="Назва категорії"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Опис категорії"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="secondary">
                        Скасування
                    </Button>
                    <Button onClick={handleEditCategory} color="primary">
                        Зберегти
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Уведомления */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Container>
    );
}

export default Categories;
