const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');

// Импорт моделей
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

// Импорт маршрутов
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Подключение маршрутов
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Маршрут по умолчанию
app.get('/', (req, res) => {
    res.send('Pharmacy system backend is running!');
});

// Синхронизация базы данных и запуск сервера
sequelize.sync({ force: false })
  .then(() => {
    console.log('All models were synchronized successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to synchronize the database:', error);
  });
