const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Запущено бекенд аптечної системи!');
});

// Синхронізація бази даних і запуск сервера
if (process.env.NODE_ENV !== 'test') {
  sequelize.sync({ force: false })
    .then(() => {
      console.log('Всі моделі були успішно синхронізовані.');
      app.listen(PORT, () => {
        console.log(`Сервер працює на порту ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Не вдається синхронізувати базу даних:', error);
    });
}

module.exports = app;