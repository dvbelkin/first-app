import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

import Login from './component/login';
import UserMenu from './component/users/userMenu';
import AdminMenu from './component/admin/adminMenu';
import Help from './component/help';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  const handleLogin = (status, userRole) => {
    setIsLoggedIn(status);
    setRole(userRole);
  };

  // If not logged in, show Login
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  } else {
    console.log('Logged in as : ', role);
  }

  return (
    <Router basename="/flask">
      <Routes>
        {/* Главная страница */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                role === 'admin'
                  ? '/admin'
                  : role === 'user'
                    ? '/user'
                    : '/login'
              }
            />
          }
        />

        {/* Админский интерфейс */}
        <Route
          path="/admin/*"
          element={role === 'admin' ? <AdminMenu /> : <Navigate to="/login" />}
        />

        {/* Пользовательский интерфейс */}
        <Route
          path="/user/*"
          element={role === 'user' ? <UserMenu /> : <Navigate to="/login" />}
        />

        {/* Дополнительные маршруты */}
        <Route path="/help" element={<Help />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Fallback для неопределённых маршрутов */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
