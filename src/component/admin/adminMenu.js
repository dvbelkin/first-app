import React from 'react';
import { Menu, Button } from 'antd';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import Home from './home';
import Help from '../help';
import Statistics from './statistics';

const items = [
  {
    key: 'logo',
    // Place the logo as a 'label' node (often you'd disable it if you don't want it clickable)
    label: (
      <img
        src={`${process.env.PUBLIC_URL}/logo_MS.gif`}
        alt="Logo"
        style={{
          height: 28,
          marginTop: 6,
          pointerEvents: 'none',
          cursor: 'default',
        }}
      />
    ),
    // If you want to prevent pointer events, you can set disabled: true
    // disabled: true
  },
  {
    label: <Link to="/admin/">Home</Link>,
    key: 'home',
  },
  {
    label: <Link to="/admin/statistics">Статистика</Link>,
    key: 'statistics',
  },

  // {
  //   label: 'Services',
  //   key: 'services',
  //   children: [
  //     {
  //       label: 'Service A',
  //       key: 'service-a',
  //     },
  //     {
  //       label: 'Service B',
  //       key: 'service-b',
  //     },
  //   ],
  // },
  {
    label: <Link to="/admin/help">Help</Link>,
    key: 'help',
  },
];

const AdminMenu = () => {
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: '0 16px',
        }}
      >
        {/* Menu takes up space */}
        <Menu mode="horizontal" style={{ flex: 1, height: 40 }} items={items} />

        {/* Button on the far right */}
        <Button
          type="primary"
          style={{ marginRight: 10, marginTop: 4, height: 30 }}
          // FIXME: Здесь конечно нужно добавть типа стереть кукисы с acsess_token
          // FIXME: Также нужно добавить проверку токена на актуальность и перенаправлять на страницу авторизации, если он просрочен
          // FIXME: Ну и отправлять кудато не сюда

          onClick={() => navigate('/')}
        >
          Выйти
        </Button>
      </div>

      {/* Nested routes under /admin/* */}
      <Routes>
        {/* Index route (i.e., /admin) */}

        <Route path="/" index element={<Home />} />
        <Route path="statistics" index element={<Statistics />} />
        {/* /admin/help */}
        <Route path="/help" element={<Help />} />

        {/* Catch-all for anything else under /admin/ */}
        <Route path="*" element={<div>Admin Page Not Found!!!</div>} />
      </Routes>
    </>
  );
};

export default AdminMenu;
