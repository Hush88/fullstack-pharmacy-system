import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, } from '@mui/material';
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
                console.error('Ошибка при получении категорий:', error);
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
            handleSnackbarOpen('Категория успешно добавлена!');
        } catch (error) {
            console.error('Ошибка при добавлении категории:', error);
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
            handleSnackbarOpen('Категория успешно отредактирована!');
        } catch (error) {
            console.error('Ошибка при редактировании категории:', error);
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
            handleSnackbarOpen('Категория успешно удалена!');
        } catch (error) {
            console.error('Ошибка при удалении категории:', error);
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
            <Typography variant="h4" gutterBottom>
                Управление категориями
            </Typography>

            <TextField
                label="Поиск категорий"
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                margin="normal"
            />

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Название</TableCell>
                        <TableCell style={{ maxWidth: 200 }}>Описание</TableCell>
                        <TableCell>Действия</TableCell>
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
                                    Редактировать
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => handleDeleteCategory(category.id)} style={{ marginLeft: '10px' }}>
                                    Удалить
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>

            <Typography variant="h4" gutterBottom>
                Добавление категорий
            </Typography>

            <form>
                <TextField
                    label="Название категории"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Описание категории"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={handleAddCategory}>
                    Добавить категорию
                </Button>
            </form>

            {/* Модальное окно для редактирования категории */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Редактирование категории</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Пожалуйста, внесите изменения в данные категории.
                    </DialogContentText>
                    <TextField
                        label="Название категории"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание категории"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleEditCategory} color="primary">
                        Сохранить
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
