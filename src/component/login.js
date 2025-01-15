import React, { useState } from 'react';
import { Button, Input, Form, Card, message, Flex, Typography } from 'antd';

const { Title, Text } = Typography;

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      const response = await fetch(
        'https://apps.mediasoft.ru/flask/test/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
          credentials: 'include', // Ensure cookies are sent and stored
        }
      );

      if (!response.ok) {
        throw new Error('Failed to log in. Please check your credentials.');
      }

      // Optional: Parse response if needed
      const data = await response.json();

      console.log('Login successful:', data);

      onLogin(true, data.role);
      message.success('Login successful!');
    } catch (error) {
      console.error('Error during login:', error);
      message.error(error.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'white',
      }}
    >
      <Card style={{ width: 300, borderColor: 'blue' }} justify="center">
        <Flex justify="center" align="center" vertical>
          <img src={`${process.env.PUBLIC_URL}/logo_MS.gif`} alt="logo" />
          <Text strong>Вход в личный кабинет</Text>
          <Text type="secondary" style={{ marginBottom: '2vh' }}>
            Введите ваши данные
          </Text>
        </Flex>
        <Form onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
