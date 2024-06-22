import React from 'react';
import { Form, Input } from 'antd';

import useLanguage from '@/locale/useLanguage';
import '@/myCSS/myLoginForm.css';

export default function LoginForm() {
  const translate = useLanguage();
  return (
    <>
      <div className="TopBlank">
          Log in to Detector
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
          placeholder={translate("email")}
          className="myEmail"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="password"
        className="InputBox"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.Password
          placeholder={translate('password')}
          className="myPassword"
          size="large"
        />
      </Form.Item>
    </>
  );
}
