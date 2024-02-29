import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';

import { Form, Button } from 'antd';

import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import LoginForm from '@/forms/LoginForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';
import '@/myCSS/myLoginForm.css';
import icon from '@/images/add-user.png';
import arrow from '@/images/rightarrowpro.png';

const LoginPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  // const size = useSize();

  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          layout="vertical"
          name="normal_login"
          className="LoginForm"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <LoginForm />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="LoginButton"
              loading={isLoading}
            >
              {translate('Log in')}
            </Button>
            <a className="ForgotPassword" href="/forgetpassword">
              {translate('Forgot password')}
            </a>
            <div className="Or">
              <div className="OrText">
                or
              </div>
              <hr className="Line"></hr>
            </div>
          </Form.Item>

          
          <a className="NewAccountLink" href="/register">
            <div className="Option">
              <img
                className="Icon"
                src={icon}
                alt=""
              />
              <div className="OptionText">Create New Account</div>
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

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Log in to Dictator" />;
};

export default LoginPage;
