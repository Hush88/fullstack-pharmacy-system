const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Створення категорії (тільки для admin і manager)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'manager'),
  async (req, res) => {
    try {
      const { name, description } = req.body;
      const category = await Category.create({ name, description });
      res.status(201).json(category);
    } catch (error) {
      res
        .status(400)
        .json({
          message: 'Помилка під час створення категорії',
          error: error.message,
        });
    }
  }
);

// Отримання всіх категорій
router.get('/', authenticateToken, async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Помилка під час отримання категорій',
        error: error.message,
      });
  }
});

// Оновлення категорії (тільки для admin і manager)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'manager'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: 'Категорія не знайдена' });
      }

      category.name = name;
      category.description = description;
      await category.save();

      res.status(200).json(category);
    } catch (error) {
      res
        .status(400)
        .json({
          message: 'Помилка під час оновлення категорії',
          error: error.message,
        });
    }
  }
);

// Видалення категорії (тільки для admin)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: 'Категорія не знайдена' });
      }

      await category.destroy();
      res.status(200).json({ message: 'Категорію успішно видалено' });
    } catch (error) {
      res
        .status(500)
        .json({
          message: 'Помилка під час видалення категорії',
          error: error.message,
        });
    }
  }
);

module.exports = router;
