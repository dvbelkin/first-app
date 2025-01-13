// src/components/DataForm.js
import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  message,
  Space,
} from 'antd';
import { fetchPersonal, fetchProjects } from './api'; // Предполагаем, что у вас есть API-функции для получения данных

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'; // Плагин для локализованного формата
import 'dayjs/locale/ru'; // Импорт локали (например, русский)

const { Option } = Select;

dayjs.extend(localizedFormat);
dayjs.locale('ru'); // Установка локали

const DataForm = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [personalOptions, setPersonalOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);

  const [isDebitFilled, setIsDebitFilled] = useState(false);
  const [isCreditFilled, setIsCreditFilled] = useState(false);

  useEffect(() => {
    // Получение списка персонала

    fetchPersonal()
      .then((data) => setPersonalOptions(data))
      .catch((err) => {
        console.error(err);
        message.error('Ошибка при загрузке списка персонала');
      });
    // Получение списка проектов
    fetchProjects()
      .then((data) => setProjectOptions(data))
      .catch((err) => {
        console.error(err);
        message.error('Ошибка при загрузке списка проектов');
      });
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  const handleDebitChange = (value) => {
    setIsDebitFilled(!!value);
    if (value) {
      form.setFieldsValue({ credit: 0 });
    }
  };

  const handleCreditChange = (value) => {
    setIsCreditFilled(!!value);
    if (value) {
      form.setFieldsValue({ debit: 0 });
    }
  };

  const onFinish = (values) => {
    // Проверка: должно быть заполнено только одно из полей debit или credit
    if ((values.debit && values.credit) || (!values.debit && !values.credit)) {
      message.error(
        'Пожалуйста, заполните только одно из полей Debit или Credit.'
      );
      return;
    }

    // Преобразование даты в нужный формат, если необходимо
    const formattedValues = {
      ...values,
      date: values.date ? dayjs(values.date) : null,
    };

    onSubmit(formattedValues);

    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="ФИО"
        name="name"
        rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
      >
        <Select
          showSearch
          placeholder="Select or type a name"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          allowClear
          dropdownRender={(menu) => (
            <>
              {menu}
              <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                {/* Здесь можно добавить кнопку для создания нового элемента, если нужно */}
              </div>
            </>
          )}
        >
          {personalOptions.map((person) => (
            <Option key={person.value} value={person.text}>
              {person.text}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Проект"
        name="project"
        rules={[{ required: true, message: 'Пожалуйста, выберите проект' }]}
      >
        <Select
          showSearch
          placeholder="Select or type a project"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          allowClear
          dropdownRender={(menu) => (
            <>
              {menu}
              <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                {/* Здесь можно добавить кнопку для создания нового проекта, если нужно */}
              </div>
            </>
          )}
        >
          {projectOptions.map((project) => (
            <Option key={project.value} value={project.text}>
              {project.text}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Получено (руб.)" name="debit">
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          onChange={handleDebitChange}
          disabled={isCreditFilled}
        />
      </Form.Item>

      <Form.Item label="Потрачено (руб.)" name="credit">
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          onChange={handleCreditChange}
          disabled={isDebitFilled}
        />
      </Form.Item>

      <Form.Item
        label="Дата"
        name="date"
        rules={[{ required: true, message: 'Пожалуйста, выберите дату' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Описание операции"
        name="description"
        rules={[{ required: true, message: 'Пожалуйста, введите описание' }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              onCancel();
            }}
          >
            Нет
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default DataForm;
