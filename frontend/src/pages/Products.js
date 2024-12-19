import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Select, MenuItem } from '@mui/material';
import axios from '../api/axios';

function Products() {

  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProducts(response.data);
        setFilteredProducts(response.data); // Отображение всех товаров по умолчанию
      } catch (error) {
        console.error('Ошибка при получении товаров:', error);
      }
    };
    fetchProducts();
  }, []);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleAddProduct = async () => {
    try {
      const response = await axios.post(
        '/products',
        { name, price, quantity, categoryId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setProducts([...products, response.data]);
      handleSnackbarOpen('Товар успешно добавлен!');
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
      handleSnackbarOpen('Ошибка при добавлении товара');
    }
  };

  const handleEditProductClick = (product) => {
    setSelectedProduct(product);
    setName(product.name);
    setPrice(product.price);
    setQuantity(product.quantity);
    setCategoryId(product.categoryId);
    setEditDialogOpen(true);
  };

  const handleEditProduct = async () => {
    try {
      const response = await axios.put(
        `/products/${selectedProduct.id}`,
        { name, price, quantity, categoryId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setProducts(products.map((p) => (p.id === selectedProduct.id ? response.data : p)));
      setEditDialogOpen(false);
      handleSnackbarOpen('Товар успешно отредактирован!');
    } catch (error) {
      console.error('Ошибка при редактировании товара:', error);
      handleSnackbarOpen('Ошибка при редактировании товара');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(products.filter((product) => product.id !== id));
      handleSnackbarOpen('Товар успешно удален!');
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      handleSnackbarOpen('Ошибка при удалении товара');
    }
  };

  const handleSortChange = (event) => {
    const option = event.target.value;
    setSortOption(option);
  
    let sortedProducts = [...filteredProducts];
    if (option === 'alphabet') {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === 'quantity') {
      sortedProducts.sort((a, b) => b.quantity - a.quantity);
    } else if (option === 'price') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (option === 'category') {
      sortedProducts.sort((a, b) => {
        const categoryA = categories.find((cat) => cat.id === a.categoryId)?.name || '';
        const categoryB = categories.find((cat) => cat.id === b.categoryId)?.name || '';
        return categoryA.localeCompare(categoryB);
      });
    }
  
    setFilteredProducts(sortedProducts);
  };
  

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        categories.find((cat) => cat.id === product.categoryId)?.name.toLowerCase().includes(query)
    );

    setFilteredProducts(filtered);
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
        Управление товарами
      </Typography>

      <TextField
        label="Поиск товаров"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
      <Select
        value={sortOption}
        onChange={handleSortChange}
        fullWidth
        displayEmpty
        style={{ marginBottom: '20px' }}
      >
        <MenuItem value="">Без сортировки</MenuItem>
        <MenuItem value="alphabet">По алфавиту</MenuItem>
        <MenuItem value="quantity">По количеству</MenuItem>
        <MenuItem value="price">По цене</MenuItem>
        <MenuItem value="category">По категории</MenuItem>
      </Select>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Цена</TableCell>
            <TableCell>Количество</TableCell>
            <TableCell>Категория</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell style={{ color: product.quantity < 50 ? 'red' : 'inherit' }}>
                {product.quantity}
              </TableCell>
              <TableCell>{categories.find((category) => category.id === product.categoryId)?.name || 'Неизвестно'}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" onClick={() => handleEditProductClick(product)}>
                  Редактировать
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteProduct(product.id)} style={{ marginLeft: '10px' }}>
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="h4" gutterBottom>
        Добавление товаров
      </Typography>

      <form>
        <TextField
          label="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Цена"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Количество"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label=""
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          fullWidth
          margin="normal"
          SelectProps={{
            native: true,
          }}
        >
          <option value="" >Выберите категорию</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </TextField>
        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Добавить товар
        </Button>
      </form>

      {/* Модальное окно для редактирования товара */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Редактирование товара</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Пожалуйста, внесите изменения в данные товара.
          </DialogContentText>
          <TextField
            label="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Цена"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Количество"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label=""
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            fullWidth
            margin="normal"
            SelectProps={{
              native: true,
            }}
          >
            <option value="" >Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleEditProduct} color="primary">
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

export default Products;
