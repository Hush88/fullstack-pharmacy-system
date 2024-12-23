const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Створення товару (тільки для admin і manager)
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { name, price, quantity, categoryId } = req.body;
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Категорія не знайдена' });
    }
    const product = await Product.create({ name, price, quantity, categoryId });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Помилка під час створення товару', error: error.message });
  }
});

// Отримання всіх товарів
router.get('/', authenticateToken, async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Помилка під час отримання товарів', error: error.message });
  }
});

// Оновлення товару (тільки для admin і manager)
router.put('/:id', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, categoryId } = req.body;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Товар не знайдено' });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Категорія не знайдена' });
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;
    product.categoryId = categoryId;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Помилка під час оновлення товару', error: error.message });
  }
});

// Видалення товару (тільки для admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Товар не знайдено' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Товар успішно видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка під час видалення товару', error: error.message });
  }
});

module.exports = router;
