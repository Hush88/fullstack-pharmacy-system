const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Создание товара (только для admin и manager)
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { name, price, quantity, expiration_date, categoryId } = req.body;
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Категория не найдена' });
    }
    const product = await Product.create({ name, price, quantity, expiration_date, categoryId });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании товара', error: error.message });
  }
});

// Получение всех товаров
router.get('/', authenticateToken, async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении товаров', error: error.message });
  }
});

// Обновление товара (только для admin и manager)
router.put('/:id', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, expiration_date, categoryId } = req.body;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Категория не найдена' });
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;
    product.expiration_date = expiration_date;
    product.categoryId = categoryId;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении товара', error: error.message });
  }
});

// Удаление товара (только для admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Товар успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении товара', error: error.message });
  }
});

module.exports = router;
