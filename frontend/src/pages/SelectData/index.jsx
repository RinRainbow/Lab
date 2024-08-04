import React from 'react';
import { Button, Flex, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const fileList = [
    {
      uid: '0',
      name: 'xxx.png',
      status: 'uploading',
      percent: 33,
    },
    {
      uid: '-1',
      name: 'yyy.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'zzz.png',
      status: 'error',
    },
];

export default function SelectData() {
    return (
      <div className="whiteBox shadow">
        <div className='data card' style={{padding: '30px 30px 15px 30px'}}>
            <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture"
                defaultFileList={[...fileList]}
                >
                <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
        </div>
        <div className='button set' style={{padding: '15px 30px 30px 0px'}}>
          <Flex justify="flex-end" align='flex-end' gap="small" wrap>
            <Button type="primary">Save</Button>
          </Flex>
        </div>
        
      </div>
    );
}