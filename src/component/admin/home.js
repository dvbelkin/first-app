import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Space,
  Popconfirm,
} from 'antd';
import moment from 'moment';

// Ant Design icons
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const Home = () => {
  const [data, setData] = useState([]); // Start with empty array
  const [editingRow, setEditingRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    key: null,
    name: '',
    debit: 0,
    credit: 0,
    project: '',
    date: '',
    description: '',
  });

  // 1. Fetch data from server when component mounts
  useEffect(() => {
    fetch('https://apps.mediasoft.ru/flask/test/base', {
      method: 'GET',
      credentials: 'include', // <-- очень важно
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((jsonData) => {
        // Suppose the server returns an array of objects
        // Each object should have fields like: { key, name, debit, credit, ... }
        setData(jsonData);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
      });
  }, []);

  // ---- Actions ----
  const onNewRow = () => {
    setEditingRow(null);
    setFormValues({
      key: null,
      name: '',
      debit: 0,
      credit: 0,
      project: '',
      date: '',
      description: '',
    });
    setIsModalVisible(true);
  };

  const onEditRow = (record) => {
    setEditingRow(record.key);
    setFormValues({
      key: record.key,
      name: record.name,
      debit: record.debit,
      credit: record.credit,
      project: record.project,
      date: record.date,
      description: record.description,
    });
    setIsModalVisible(true);
  };

  const onDeleteRow = (key) => {
    setData((prevData) => prevData.filter((item) => item.key !== key));
  };

  // ---- Modal form field changes ----
  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleOk = () => {
    if (editingRow === null) {
      // Creating a new row
      // Generate a unique key if needed
      const newKey = data.length ? data[data.length - 1].key + 1 : 1;
      const newRow = { key: newKey, ...formValues };
      setData((prevData) => [...prevData, newRow]);
    } else {
      // Updating an existing row
      setData((prevData) =>
        prevData.map((item) =>
          item.key === editingRow
            ? { ...item, ...formValues, key: editingRow }
            : item
        )
      );
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // ---- Table Columns ----
  const columns = [
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEditRow(record)} />
          <Popconfirm
            title="Are you sure to delete this row?"
            onConfirm={() => onDeleteRow(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
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
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={onNewRow} style={{ marginBottom: 16 }}>
        New Row
      </Button>

      <Table columns={columns} dataSource={data} />

      {/* Modal for adding/editing a row */}
      <Modal
        title={editingRow === null ? 'Add New Row' : 'Edit Row'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
      >
        <div style={{ marginBottom: 16 }}>
          <label>Name:</label>
          <Input
            value={formValues.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Debit (руб.):</label>
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            value={formValues.debit}
            onChange={(value) => handleInputChange('debit', value)}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Credit (руб.):</label>
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            value={formValues.credit}
            onChange={(value) => handleInputChange('credit', value)}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Project:</label>
          <Select
            style={{ width: '100%' }}
            placeholder="Select a project"
            value={formValues.project}
            onChange={(value) => handleInputChange('project', value)}
          >
            <Option value="Project A">Project A</Option>
            <Option value="Project B">Project B</Option>
            <Option value="Project C">Project C</Option>
          </Select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Date:</label>
          <DatePicker
            style={{ width: '100%' }}
            value={
              formValues.date ? moment(formValues.date, 'YYYY-MM-DD') : null
            }
            onChange={(dateObj, dateStr) => handleInputChange('date', dateStr)}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Description:</label>
          <Input.TextArea
            rows={3}
            value={formValues.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Home;
