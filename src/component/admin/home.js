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
  message,
} from 'antd';
import moment from 'moment';

// Ant Design icons
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchBase, fetchPersonal, fetchProjects } from '../api';
import DataForm from '../inputDataForm'; // Импортируем новый компонент формы
import { format } from 'prettier';

const { Option } = Select;

const Home = () => {
  const [data, setData] = useState([]); // Start with empty array
  const [editingRow, setEditingRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [project, setProject] = useState([]); // Start with empty array
  const [personal, setPersonal] = useState([]); // Start with empty array

  const nullValueForm = {
    key: null,
    name: '',
    debit: 0,
    credit: 0,
    project: '',
    date: '',
    description: '',
  };

  const [formValues, setFormValues] = useState(nullValueForm); // Start with empty array

  // 1. Fetch data from server when component mounts
  useEffect(() => {
    fetchBase()
      .then((data) => setData(data))
      .catch((err) => {
        console.error(err);
        message.error('Ошибка при загрузке списка  основных данных');
      });

    fetchPersonal()
      .then((data) => setPersonal(data))
      .catch((err) => {
        console.error(err);
        message.error('Ошибка при загрузке списка персонала');
      });

    // Получение списка проектов
    fetchProjects()
      .then((data) => setProject(data))
      .catch((err) => {
        console.error(err);
        message.error('Ошибка при загрузке списка проектов');
      });
  }, []);

  // ---- Actions ----
  const onNewRow = () => {
    setEditingRow(null);
    setFormValues(nullValueForm);
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
    message.success('Запись удалена');
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
      console.log('Updating!!!!!!!!!!!!!!');
      setData((prevData) =>
        prevData.map((item) =>
          item.key === editingRow
            ? { ...item, ...formValues, key: editingRow }
            : item
        )
      );
      message.success('Запись обновлена');
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // ---- Table Columns ----
  const columns = [
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEditRow(record)} />
          <Popconfirm
            title="Вы согласны удалить эту строку?"
            onConfirm={() => onDeleteRow(record.key)}
            okText="Да"
            cancelText="Нет"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      filters: personal,
      onFilter: (value, record) => record.name === value,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Приход (руб.)',
      dataIndex: 'debit',
      key: 'debit',
      sorter: (a, b) => a.debit - b.debit,
    },
    {
      title: 'Оплата (руб.)',
      dataIndex: 'credit',
      key: 'credit',
      sorter: (a, b) => a.debit - b.debit,
    },
    {
      title: 'Проект',
      dataIndex: 'project',
      key: 'project',
      filters: project,
      onFilter: (value, record) => record.project === value,
      sorter: (a, b) => a.project.localeCompare(b.project),
    },
    {
      title: 'Дата операции',
      dataIndex: 'date',
      key: 'date',
      render: (text) => moment(text).format('YYYY-MM-DD'),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: 'Подробности',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={onNewRow} style={{ marginBottom: 16 }}>
        New Row
      </Button>

      <Table
        columns={columns}
        dataSource={data}
        onHeaderRow={() => {
          <Button
            type="primary"
            onClick={onNewRow}
            style={{ marginBottom: 16 }}
          >
            New Row
          </Button>;
        }}
      />

      {/* Modal с формой */}

      <Modal
        title={editingRow === null ? 'Add New Row' : 'Edit Row'}
        open={isModalVisible}
        footer={null} // Переходим на форму с собственными кнопками
        onCancel={handleCancel}
      >
        <DataForm
          initialValues={formValues}
          onSubmit={handleOk}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default Home;
