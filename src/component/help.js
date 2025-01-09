import React, { useState } from 'react';
import { Modal, Button } from 'antd';

const Help = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  return (
    <>
      <Modal
        title="Help"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            OK
          </Button>,
          
        ]}
      >
        <p>Welcome to the Help section!</p>
        <p>Here you will find tips and guidance about our app.</p>
        <p>Here you will find tips and guidance about our app.</p>
      </Modal>
    </>
  );
};

export default Help;
