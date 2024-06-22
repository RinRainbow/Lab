import React from 'react';
import { Form, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';

// import useLanguage from '@/locale/useLanguage';
import '@/myCSS/myForgotPassword.css';

export default function ForgetPasswordForm() {
  return (
    <>
      <div className="TopBlank">
          Reset Password
      </div>
      <Form.Item
        name="email"
        className="InputBox"
        rules={[
          {
            required: true,
          },
          {
            type: 'email',
          },
        ]}
      >
        <Input
          type="email"
          placeholder="Email"
          className="InputBox"
          size="large"
        />
      </Form.Item>
    </>
  );
}
