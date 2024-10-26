import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Button, Flex, Modal, Input } from 'antd';

const { Dragger } = Upload;

const boxStyle = {
  width: '100%',
  height: 80,
  // background: 'red',
};

export default function UploadPage() {
  const [hasUploaded, setHasUploaded] = useState(false);
  const props = {
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange({ file, fileList }) {
      if(fileList.length > 0) {
        setHasUploaded(true);
      }
      else {
        setHasUploaded(false);
      }
      if (file.status !== 'uploading') {
        console.log(file, fileList);
        file.status = 'done';
        // fileList.forEach(item => {
        //   item.status = 'done';
        // });
      }
    },
  };
  /* ----- Creating Dataset Modal Handler ----- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const saved = () => {
    console.log('DatasetName:', DatasetName);
    const requestData = {'datasetname': DatasetName};
    fetch('http://localhost:1624/api/dataset/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      message.success('Upload Successful!');
    })
    .catch(error => {
      console.error('Error:', error);
      message.error('Upload Error!');
    });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    saved();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [DatasetName, setDatasetName] = useState();
  const saveInput = (e) => {
    setDatasetName(e.target.value);
    console.log('dataset name: ', e.target.value);
  };
  /* ----- Creating Dataset Modal Handler END ----- */
    return (
        <div className="whiteBox shadow">
            <div className='upload area' style={{padding: '30px 30px 30px 30px'}}>
                <h2 style={{ color: '#22075e', marginBottom: 20, marginTop: 15 }}>
                  Upload Area
                </h2>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company secret data or other
                    banned files.
                    </p>
                </Dragger>
                <Flex style={boxStyle} justify={'flex-end'} align={'flex-end'}>
                  <Button
                  type="primary"
                  onClick={showModal}
                  disabled={!hasUploaded}
                  >
                    Upload
                  </Button>
                  <Modal title="Dataset Name" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Input 
                      name='Dataset Name'
                      onChange={saveInput}
                      allowClear
                      placeholder='enter your dataset name...'
                    />
                  </Modal>
                </Flex>
            </div>
        </div>
    );
}