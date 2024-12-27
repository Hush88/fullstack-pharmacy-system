const request = require('supertest');
const app = require('../index'); // Главный файл Express
const Product = require('../models/Product');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');

// Мокаем модели
jest.mock('../models/Product', () => ({
  findByPk: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
}));
jest.mock('../models/Category', () => ({
  findByPk: jest.fn(),
}));

describe('Product Routes', () => {
  let adminToken;

  beforeAll(() => {
    // Создаем мокаемого администратора
    const admin = { id: 1, role: 'admin' };
    adminToken = jwt.sign(admin, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Очищаем моки после каждого теста
  });

  afterAll(async () => {
    await sequelize.close(); // Закрыть соединение с базой данных
  });

  test('POST /products - создание товара', async () => {
    // Мок данных категории
    Category.findByPk.mockResolvedValue({ id: 1, name: 'Test Category' });

    // Мок создания товара
    Product.create.mockResolvedValue({
      id: 1,
      name: 'Test Product',
      price: 10.99,
      quantity: 100,
      categoryId: 1,
    });

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Product',
        price: 10.99,
        quantity: 100,
        categoryId: 1,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Product');
    expect(res.body.categoryId).toBe(1);
  });

  test('GET /products - получение всех товаров', async () => {
    // Мок данных товаров
    Product.findAll.mockResolvedValue([
      {
        id: 1,
        name: 'Test Product 1',
        price: 10.99,
        quantity: 100,
        categoryId: 1,
      },
      {
        id: 2,
        name: 'Test Product 2',
        price: 20.99,
        quantity: 50,
        categoryId: 2,
      },
    ]);

    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe('Test Product 1');
  });

  test('PUT /products/:id - обновление товара', async () => {
    // Мок поиска товара
    Product.findByPk.mockResolvedValue({
      id: 1,
      name: 'Test Product',
      price: 10.99,
      quantity: 100,
      categoryId: 1,
      save: jest.fn(), // Мокаем метод save
    });

    const res = await request(app)
      .put('/api/products/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Product',
        price: 15.99,
        quantity: 50,
        categoryId: 1,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Product');
  });

  test('DELETE /products/:id - удаление товара', async () => {
    // Мок поиска товара
    Product.findByPk.mockResolvedValue({
      id: 1,
      name: 'Test Product',
      price: 10.99,
      quantity: 100,
      categoryId: 1,
      destroy: jest.fn(), // Мокаем метод destroy
    });

    const res = await request(app)
      .delete('/api/products/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Товар успішно видалено');
  });
});
