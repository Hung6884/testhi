import { UnlockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Form, Input, notification } from 'antd';
import { useState } from 'react';
import { connect, useDispatch, useIntl, useSearchParams } from 'umi';
import logo from '../../../shared/images/logo-collapsed.png';
import { SelectLang } from '../../../ui/component/SelectLang';
import FormRegister from '../../Register/FormRegister';
import styles from './style.less';

const Login = (props) => {
  const { User, submitLoading } = props;
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const redirect = searchParams.get('redirect');

  const { loginStatus } = User;
  const [rememberMe, setRememberMe] = useState(false);
  // const [showRegisterForm, setShowRegisterform] = useState(false);
  const { formatMessage } = useIntl();

  const handleSubmit = async (user) => {
    delete user.rememberMe;
    const res = await dispatch({
      type: 'User/login',
      payload: {
        ...user,
        redirect,
      },
    });
    if (res?.status === 'error') {
      notification.error({
        message: formatMessage({
          id:
            res.errorMessage === 'COMMON_ERROR'
              ? 'app.global.custom.error.message'
              : `page.user.login.error.${res.message}`,
        }),
      });
    }
  };

  const onRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className={styles.container}>
      <SelectLang className={styles.langSelect} />
      <img alt="logo" src={logo} width="128" style={{ margin: '0px auto' }} />
      <div className={styles.main}>
        {/* {showRegisterForm && (
          <FormRegister onCancel={() => setShowRegisterform(false)} />
        )} */}
        {/* {!showRegisterForm && ( */}
        <Form
          name="basic"
          onFinish={handleSubmit}
          initialValues={{
            username: localStorage.getItem('username') || '',
            password: localStorage.getItem('password') || '',
          }}
        >
          <Form.Item
            label=""
            name="username"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'page.user.login.form-item-username.required',
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'page.user.login.form-item-username',
              })}
              prefix={<UserOutlined />}
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            label=""
            name="password"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'page.user.login.form-item-password.required',
                }),
              },
            ]}
          >
            <Input.Password
              placeholder={formatMessage({
                id: 'page.user.login.form-item-password',
              })}
              className={styles.input}
              prefix={<UnlockOutlined />}
            />
          </Form.Item>

          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <Checkbox
              onChange={onRememberMeChange}
              style={{ marginBottom: '15px' }}
            >
              {formatMessage({ id: 'page.user.login.form.remember-me' })}
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className={styles.submit}
              htmlType="submit"
              loading={submitLoading}
            >
              {formatMessage({ id: 'page.user.login.form.btn-submit' })}
            </Button>
            {/* <div
              className="text-align-left"
              style={{ marginTop: '10px', width: 80, float: 'left' }}
            >
              <Button
                type="link"
                onClick={() => setShowRegisterform(true)}
                className={styles.link}
                style={{
                  paddingLeft: 0,
                }}
              >
                {formatMessage({ id: 'button.register' })}
              </Button>
            </div> */}
          </Form.Item>

          {loginStatus === 'error' && !submitLoading && (
            <Alert
              message={formatMessage({
                id: 'page.user.login.form.login-error',
              })}
              type="error"
              showIcon
            />
          )}
        </Form>
        {/* )} */}
      </div>
    </div>
  );
};

export default connect(({ User, loading }) => ({
  User,
  submitLoading: loading.effects['User/login'],
}))(Login);
