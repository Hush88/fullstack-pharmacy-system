import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Select, MenuItem, Box, Toolbar } from '@mui/material';
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
        console.error('Помилка під час отримання товарів:', error);
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
        console.error('Помилка під час отримання категорій:', error);
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
      handleSnackbarOpen('Товар успішно додано!');
    } catch (error) {
      console.error('Помилка під час додавання товару:', error);
      handleSnackbarOpen('Помилка під час додавання товару');
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
      handleSnackbarOpen('Товар успішно відредаговано!');
    } catch (error) {
      console.error('Помилка під час редагування товару:', error);
      handleSnackbarOpen('Помилка під час редагування товару');
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
      handleSnackbarOpen('Товар успішно видалено!');
    } catch (error) {
      console.error('Помилка під час видалення товару:', error);
      handleSnackbarOpen('Помилка під час видалення товару');
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
      <Typography variant="h4" gutterBottom style={{ margin: '100px 0 0 0' }}>
        Управління товарами
      </Typography>

      <TextField
        label="Пошук товарів"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
        style={{ marginTop: '40px' }}
      />
      <Select
        value={sortOption}
        onChange={handleSortChange}
        fullWidth
        displayEmpty
        style={{ marginBottom: '20px' }}
      >
        <MenuItem value="">Без сортування</MenuItem>
        <MenuItem value="alphabet">За алфавітом</MenuItem>
        <MenuItem value="quantity">За кількістю</MenuItem>
        <MenuItem value="price">За ціною</MenuItem>
        <MenuItem value="category">За категорією</MenuItem>
      </Select>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Назва</TableCell>
            <TableCell>Ціна</TableCell>
            <TableCell>Кількість</TableCell>
            <TableCell>Категорія</TableCell>
            <TableCell>Дії</TableCell>
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
                  Редагувати
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteProduct(product.id)} style={{ marginLeft: '10px' }}>
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
            Додавання товарів
          </Typography>

          <Button variant="contained" color="primary" onClick={handleAddProduct} >
            Додати товар
          </Button>
        </Toolbar>
      </Box>


      <form>
        <TextField
          label="Назва"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Ціна"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Кількість"
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
          style={{ marginBottom: '50px' }}
          SelectProps={{
            native: true,
          }}
        >
          <option value="" >Оберіть категорію</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </TextField>
      </form>

      {/* Модальное окно для редактирования товара */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Редагування товару</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Будь ласка, внесіть зміни до даних товару.
          </DialogContentText>
          <TextField
            label="Назва"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ціна"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Кількість"
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
            <option value="" >Оберіть категорію</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">
            Скасування
          </Button>
          <Button onClick={handleEditProduct} color="primary">
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

export default Products;
