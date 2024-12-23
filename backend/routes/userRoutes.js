const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Создание пользователя (только для admin)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Проверка, что все данные переданы
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10); // "password" - данные, "10" - число итераций соли

    // Создание пользователя
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json(user);
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    res.status(500).json({ message: 'Ошибка при создании пользователя', error: error.message });
  }
});

// Получение всех пользователей (только для admin)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении пользователей', error: error.message });
  }
});

// Обновление пользователя (только для admin)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.username = username;
    if (password) {
      user.password_hash = await bcrypt.hash(password, 10);
    }
    user.role = role;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении пользователя', error: error.message });
  }
});

// Удаление пользователя (только для admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    await user.destroy();
    res.status(200).json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении пользователя', error: error.message });
  }
});

module.exports = router;