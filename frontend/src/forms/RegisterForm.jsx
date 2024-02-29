import React from 'react';
import { Form, Input } from 'antd';

import useLanguage from '@/locale/useLanguage';
import '@/myCSS/myNewAccount.css';

export default function RegisterForm() {
  const translate = useLanguage();
  return (
    <>
      <div className="TopBlank">
        Create New Account
      </div>
      <Form.Item
        name="name"
        className="InputBox"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input 
          placeholder={translate("name")}
          className="InputBox"
          size="large"
        />
      </Form.Item>

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
          className="InputBox"
          type="email"
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
          placeholder={translate("password")}
          className="InputBox"
          size="large"
        />
      </Form.Item>
      
      <Form.Item
        name="confirm_password"
        className="InputBox"
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password
          placeholder={translate("confirm password")} 
          size="large"
          className="InputBox"
        />
      </Form.Item>
    </>
  );
}
