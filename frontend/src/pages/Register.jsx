import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { register } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import { Form, Button, Result } from 'antd';
import RegisterForm from '@/forms/RegisterForm';
import useLanguage from '@/locale/useLanguage';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';
import '@/myCSS/myNewAccount.css';
import icon from '@/images/login.png';
import arrow from '@/images/rightarrowpro.png';

const RegisterPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  // const size = useSize();

  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(register({ registerData: values }));
  };

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          layout="vertical"
          name="signup"
          className="CreateNewAccountForm"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <RegisterForm />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="CreateButtom"
              size="large"
            >
              {translate('Register')}
            </Button>
            <div className="Or">
              <div className="OrText">
                or
              </div>
              <hr className="Line"></hr>
            </div>
          </Form.Item>


          <a className="BackToLogin" href="/login">
            <div className="Option">
              <img
                className="Icon"
                src={icon}
                alt=""
              />
              <div className="OptionText">Log in to Detector</div>
              <img
                className="Arrow"
                src={arrow}
                alt=""
              />
            </div>
          </a>
        </Form>
      </Loading>
    );
  };

  if (!isSuccess) {
    return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign up" />;
  } else {
    return (
      <Result
        status="info"
        title={translate('Verify your account')}
        subTitle={translate('Check your email address to verify your account')}
      ></Result>
    );
  }
};

export default RegisterPage;
