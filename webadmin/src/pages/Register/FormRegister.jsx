import { Button, Form, Input, notification } from 'antd';
import { connect, useDispatch } from 'umi';

import { UnlockOutlined, UserOutlined } from '@ant-design/icons';

import { isFunction } from 'lodash';
import useIntl from '../../ui/hook/useIntl';
import styles from './style.less';

function FormRegister(props) {
  const { submitLoading, onCancel } = props;

  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const handleSubmit = async (user) => {
    const res = await dispatch({
      type: 'User/register',
      payload: {
        ...user,
      },
    });
    if (res?.status === 'error') {
      notification.error({
        message: formatMessage({
          id:
            res.errorMessage === 'COMMON_ERROR'
              ? 'app.global.custom.error.message'
              : res.message,
        }),
      });
    } else {
      notification.success({
        message: formatMessage({
          id: `page.user.register.form.register-successfully`,
        }),
      });
      isFunction(onCancel) && onCancel();
    }
  };

  return (
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
        name="email"
        rules={[
          {
            required: true,
            message: formatMessage({
              id: 'page.user.register.form-item-email.required',
            }),
          },
          {
            type: 'email',
            message: formatMessage({
              id: 'page.user.register.form-item-email.invalid',
            }),
          },
        ]}
      >
        <Input
          placeholder={formatMessage({
            id: 'page.user.login.form-item-email',
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
            // required: true,
            message: formatMessage({
              id: 'page.user.register.form-item-password.required',
            }),
          },
          {
            validator: (rule, value) => {
              if (!value) {
                return Promise.reject(
                  formatMessage({
                    id: 'page.user.register.form-item-password.required',
                  }),
                );
              }

              if (value.length < 12) {
                return Promise.reject(
                  formatMessage({
                    id: 'page.user.register.form-item-password.min',
                  }),
                );
              }

              const hasUpperCase = /[A-Z]/.test(value);
              const hasLowerCase = /[a-z]/.test(value);
              const hasDigit = /[0-9]/.test(value);
              const hasSpecialChar = /[`~!@#$%^&*()_+\-={}|\\"';'<>?,./]/.test(
                value,
              );

              const groupCount = [
                hasUpperCase,
                hasLowerCase,
                hasDigit,
                hasSpecialChar,
              ].filter(Boolean).length;

              if (groupCount < 3) {
                return Promise.reject(
                  formatMessage({
                    id: 'page.user.register.form-item-password.pattern-rule',
                  }),
                );
              }

              return Promise.resolve();
            },
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

      <Form.Item>
        <Button
          type="primary"
          className={styles.submit}
          htmlType="submit"
          loading={submitLoading}
        >
          {formatMessage({ id: 'page.user.register.form.btn-submit' })}
        </Button>
        {onCancel && (
          <Button type="link" onClick={() => onCancel()}>
            {formatMessage({ id: 'page.user.register.form.btn-cancel' })}
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}

export default connect(({ User, loading }) => ({
  User,
  submitLoading: loading.effects['User/register'],
}))(FormRegister);
