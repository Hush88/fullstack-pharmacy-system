const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Создание категории (только для admin и manager)
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании категории', error: error.message });
  }
});

// Получение всех категорий
router.get('/', authenticateToken, async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении категорий', error: error.message });
  }
});

// Обновление категории (только для admin и manager)
router.put('/:id', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    category.name = name;
    category.description = description;
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении категории', error: error.message });
  }
});

// Удаление категории (только для admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    await category.destroy();
    res.status(200).json({ message: 'Категория успешно удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении категории', error: error.message });
  }
});

module.exports = router;