import React, { useEffect, useState, useMemo } from 'react';
import { Table, message } from 'antd';
import { fetchBase } from '../api';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // Подключение русской локали

dayjs.locale('ru'); // Установка локали

const Statistics = () => {
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    // Загрузка данных
    fetchBase()
      .then((data) => setRawData(data))
      .catch((error) => {
        console.error(error);
        message.error('Ошибка загрузки данных');
      });
  }, []);

  // Группировка данных
  const groupedData = useMemo(() => {
    const grouped = {};

    rawData.forEach((item) => {
      const groupKey = `${item.name}-${item.project}`;

      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          key: groupKey,
          name: item.name,
          project: item.project,
          total_debit: 0,
          total_credit: 0,
          children: [],
        };
      }

      grouped[groupKey].total_debit += item.debit ?? 0;
      grouped[groupKey].total_credit += item.credit ?? 0;
      grouped[groupKey].children.push(item);
    });

    return Object.values(grouped).map((group) => ({
      ...group,
      difference: group.total_debit - group.total_credit,
    }));
  }, [rawData]);

  // Колонки основной таблицы
  const columns = [
    {
      title: 'ФИО',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Проект',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: 'Приход (руб.)',
      dataIndex: 'total_debit',
      key: 'total_debit',
      render: (value) => (value !== undefined ? value.toFixed(2) : '0.00'),
    },
    {
      title: 'Расход (руб.)',
      dataIndex: 'total_credit',
      key: 'total_credit',
      render: (value) => (value !== undefined ? value.toFixed(2) : '0.00'),
    },
    {
      title: 'Разница (руб.)',
      dataIndex: 'difference',
      key: 'difference',
      render: (value) => (
        <span style={{ color: value >= 0 ? 'green' : 'red' }}>
          {value !== undefined ? value.toFixed(2) : '0.00'}
        </span>
      ),
    },
  ];

  // Колонки для вложенной таблицы
  const expandedRowColumns = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      render: (value) =>
        value ? dayjs(value).format('YYYY-MMM-DD') : 'Нет данных',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Приход (руб.)',
      dataIndex: 'debit',
      key: 'debit',
      render: (value) => (value !== undefined ? value.toFixed(2) : '0.00'),
    },
    {
      title: 'Расход (руб.)',
      dataIndex: 'credit',
      key: 'credit',
      render: (value) => (value !== undefined ? value.toFixed(2) : '0.00'),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Статистика по ФИО и Проектам</h2>
      <Table
        columns={columns}
        dataSource={groupedData}
        rowKey={(record) => record.key}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => (
            <Table
              columns={expandedRowColumns}
              dataSource={record.children}
              pagination={false}
              rowKey={(item) => item.key}
            />
          ),
        }}
      />
    </div>
  );
};

export default Statistics;
