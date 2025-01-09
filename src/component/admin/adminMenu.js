import React from 'react';
import { Menu, Button } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import Home from '../home';
import Help from '../help';


const AdminMenu = () => {
  return (
    <>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
                
        {/* Logo Section */}
        
        <img src='/logo_MS.gif' alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
        
        <Menu mode="horizontal">
          <Menu.Item key="home">
            <Link to="/admin/">Home</Link>
          </Menu.Item>
          
          <Menu.Item key="about">
            <Link to="/admin/about">About</Link>
          </Menu.Item>

          <Menu.Item key="help">
            <Link to="/admin/help">Help</Link>
          </Menu.Item>
        </Menu>

        
      </div>

        {/* Button Section */}
        <div >
          <Button type="primary" 
            style={{ marginLeft: '20px'}} 
            onClick={() => alert('Button Clicked!')}
          >
            Sign Up
          </Button>

        </div>  

    </div>
         {/* Nested routes under /admin/* */}
      <Routes>
        {/* Index route (i.e., /admin) */}
        <Route path="/" index element={<Home />} />

        {/* /admin/help */}
        <Route path="/help" element={<Help />} />

        {/* Catch-all for anything else under /admin/ */}
        <Route path="*" element={<div>Admin Page Not Found</div>} />
      </Routes>
    </>

  );
};

export default AdminMenu;
