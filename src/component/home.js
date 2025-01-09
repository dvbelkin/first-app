import React, { useState } from 'react';
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
  // Sample data
  const [data, setData] = useState([
    {
      key: 1,
      name: 'John Doe',
      debit: 1500,
      credit: 700,
      project: 'Project A',
      date: '2025-01-01',
      description: 'Initial payment',
    },
    {
      key: 2,
      name: 'Jane Smith',
      debit: 2000,
      credit: 1000,
      project: 'Project B',
      date: '2025-01-02',
      description: 'Second installment',
    },
  ]);

  // Whether we’re adding a new row (null) or editing an existing row (the row’s key)
  const [editingRow, setEditingRow] = useState(null);

  // Modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Form values in the modal
  const [formValues, setFormValues] = useState({
    key: null,
    name: '',
    debit: 0,
    credit: 0,
    project: '',
    date: '',
    description: '',
  });

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

  // Modal form field changes
  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleOk = () => {
    if (editingRow === null) {
      // Creating a new row
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
          <Button
            icon={<EditOutlined />}
            onClick={() => onEditRow(record)}
          />
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
              formValues.date
                ? moment(formValues.date, 'YYYY-MM-DD')
                : null
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
