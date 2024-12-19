import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Products from './pages/Products';
import Users from './pages/Users';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import Categories from './pages/Categories';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/users" element={<Users />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
