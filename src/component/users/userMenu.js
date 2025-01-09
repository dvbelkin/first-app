import React from 'react';
import { Menu, Button } from 'antd';
import { Link } from 'react-router-dom';


const UserMenu = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Logo Section */}
        
        <img src='/logo_MS.gif' alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
        
        <Menu mode="horizontal">
          <Menu.Item key="home">
            <Link to="/admin">Home</Link>
          </Menu.Item>
          <Menu.Item key="about">
            <Link to="/admin/statistica">User</Link>
          </Menu.Item>
          <Menu.Item key="help">
            <Link to="/help">Help</Link>
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
  );
};

export default UserMenu;
