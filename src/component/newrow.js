import React, { useState } from 'react';
import { Table, Form, Input, InputNumber, Button, DatePicker, Select } from 'antd';
import moment from 'moment';

const { Option } = Select;

const Home = () => {
  // Define columns for your table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Debit (руб.)',
      dataIndex: 'debit',
      key: 'debit',
    },
    {
      title: 'Credit (руб.)',
      dataIndex: 'credit',
      key: 'credit',
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  // Example initial data
  const [data, setData] = useState([
    {
      key: 1,
      name: 'John Doe',
      debit: 1500,
      credit: 700,
      project: 'Project A',
      date: '2025-01-01',
    },
    {
      key: 2,
      name: 'Jane Smith',
      debit: 2000,
      credit: 1000,
      project: 'Project B',
      date: '2025-01-02',
    },
  ]);

  // Handle form submission
  const onFinish = (values) => {
    const newKey = data.length ? data[data.length - 1].key + 1 : 1;

    // Format date to a string (YYYY-MM-DD) if needed
    const formattedDate = values.date ? values.date.format('YYYY-MM-DD') : '';

    const newRow = {
      key: newKey,
      name: values.name,
      debit: values.debit,
      credit: values.credit,
      project: values.project,
      date: formattedDate,
    };

    setData([...data, newRow]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Home Page</h1>

      {/* Form for adding a new row */}
      <Form
        name="add-row-form"
        layout="vertical"
        onFinish={onFinish}
        style={{ marginBottom: 20, maxWidth: 600 }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter a name' }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          label="Debit (руб.)"
          name="debit"
          rules={[{ required: true, message: 'Please enter a debit amount' }]}
        >
          <InputNumber
            placeholder="Enter debit"
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Credit (руб.)"
          name="credit"
          rules={[{ required: true, message: 'Please enter a credit amount' }]}
        >
          <InputNumber
            placeholder="Enter credit"
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Project"
          name="project"
          rules={[{ required: true, message: 'Please enter or select a project' }]}
        >
          <Select placeholder="Select a project">
            <Option value="Project A">Project A</Option>
            <Option value="Project B">Project B</Option>
            <Option value="Project C">Project C</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Date" name="date">
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={(currentDate) =>
              currentDate && currentDate < moment().startOf('day')
            }
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Row
          </Button>
        </Form.Item>
      </Form>

      {/* Table displaying the data */}
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Home;
