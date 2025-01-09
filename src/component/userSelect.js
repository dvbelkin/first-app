import React, { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import axios from 'axios';

const { Option } = Select;

const ProjectSelect = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // Предположим, сервер запущен на localhost:3001
        const response = await axios.get('http://localhost:3001/api/projects');
        // response.data - это массив объектов [{ id: 1, name: 'Проект А'}, ...]
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <Spin tip="Loading projects..." />;
  }

  return (
    <Select
      style={{ width: 200 }}
      placeholder="Select project"
    >
      {options.map((item) => (
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      ))}
    </Select>
  );
};

export default ProjectSelect;
