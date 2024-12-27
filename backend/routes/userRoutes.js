const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Створення користувача (тільки для admin)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { username, password, role } = req.body;

      if (!username || !password || !role) {
        return res.status(400).json({ message: 'Усі поля обовязкові' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        password: hashedPassword,
        role,
      });
      res.status(201).json(user);
    } catch (error) {
      console.error('Помилка під час створення користувача:', error);
      res.status(500).json({
        message: 'Помилка під час створення користувача',
        error: error.message,
      });
    }
  }
);

// Отримання всіх користувачів (тільки для admin)
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: 'Помилка під час отримання користувачів',
        error: error.message,
      });
    }
  }
);

// Оновлення користувача (тільки для admin)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, role } = req.body;
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: 'Користувач не знайдений' });
      }

      user.username = username;
      if (password) {
        user.password_hash = await bcrypt.hash(password, 10);
      }
      user.role = role;
      await user.save();

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({
        message: 'Помилка під час оновлення користувача',
        error: error.message,
      });
    }
  }
);

// Видалення користувача (тільки для admin)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: 'Користувач не знайдений' });
      }

      await user.destroy();
      res.status(200).json({ message: 'Користувача успішно видалено' });
    } catch (error) {
      res.status(500).json({
        message: 'Помилка під час видалення користувача',
        error: error.message,
      });
    }
  }
);

module.exports = router;
