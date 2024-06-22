import { useNavigate } from 'react-router-dom';

import { Form, Result, Button } from 'antd';
import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';

import ForgetPasswordForm from '@/forms/ForgetPasswordForm';

import useLanguage from '@/locale/useLanguage';

import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

import '@/myCSS/myForgotPassword.css';
import icon from '@/images/login.png';
import arrow from '@/images/rightarrowpro.png';

const ForgetPassword = () => {
  const translate = useLanguage();

  const navigate = useNavigate();

  const { onFetch, isSuccess, isLoading } = useOnFetch();

  async function postData(data) {
    return await request.post({ entity: 'forgetpassword', jsonData: data });
  }

  const onFinish = (values) => {
    const callback = postData(values);
    onFetch(callback);
  };

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          name="signup"
          className="ForgotPasswordForm"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <ForgetPasswordForm />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="ResetButton"
              size="large"
            >
              {translate('Request new Password')}
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
    return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Forget Password" />;
  } else {
    return (
      <Result
        status="success"
        title={translate('Password Reset in progress')}
        subTitle={translate('Check your email address to reset your password')}
        extra={
          <Button
            type="primary"
            onClick={() => {
              navigate(`/login`);
            }}
          >
            {translate('Login')}
          </Button>
        }
      ></Result>
    );
  }
};

export default ForgetPassword;
