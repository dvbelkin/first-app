import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, Space, Popconfirm, message } from 'antd';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'; // Плагин для локализованного формата
import 'dayjs/locale/ru'; // Импорт локали (например, русский)

// Ant Design icons
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchBase, fetchPersonal, fetchProjects } from '../api';
import DataForm from '../inputDataForm'; // Импортируем новый компонент формы

dayjs.extend(localizedFormat);
dayjs.locale('ru'); // Установка локали

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
    date: null,
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
    console.log('onNewRow');
    setEditingRow(null);
    setFormValues(nullValueForm);
    setIsModalVisible(true);
  };

  const onEditRow = (record) => {
    setEditingRow(record.key);

    const updatedValues = {
      key: record.key,
      name: record.name,
      debit: record.debit,
      credit: record.credit,
      project: record.project,
      date: record.date ? dayjs(record.date) : null,
      description: record.description,
    };

    setFormValues(updatedValues);

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

  const handleOk = (updatedValues) => {
    if (editingRow === null) {
      // Добавление новой записи
      const newRow = { key: Date.now(), ...updatedValues }; // Уникальный ключ
      setData((prevData) => [...prevData, newRow]); // Добавляем новую строку
      message.success('Новая запись добавлена.');
    } else {
      // Обновление существующей записи
      setData((prevData) =>
        prevData.map((item) =>
          item.key === editingRow ? { ...item, ...updatedValues } : item
        )
      );
      message.success('Запись обновлена.');
    }

    // Закрываем модальное окно
    setIsModalVisible(false);
    setEditingRow(null); // Сбрасываем редактируемую строку
    setFormValues(nullValueForm); // Сбрасываем значения формы
  };

  const handleCancel = () => {
    setFormValues(nullValueForm);
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
      render: (text) => dayjs(text).format('YYYY-MMM-DD'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
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
        Новый
      </Button>

      <Table columns={columns} dataSource={data} />

      {/* Modal с формой */}

      <Modal
        title={
          editingRow === null ? 'Добавить новую строку' : 'Редактировать строку'
        }
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
