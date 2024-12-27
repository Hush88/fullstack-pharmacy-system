const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Реєстрація користувача
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Користувач із таким іменем уже існує' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: passwordHash, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      message: 'Помилка під час реєстрації користувача',
      error: error.message,
    });
  }
});

// Вхід у систему
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Необхідно ввести логін і пароль' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Користувач не знайдено' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Невірний пароль' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    console.error('Помилка на сервері:', error); // Логируем ошибку
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
});

module.exports = router;
