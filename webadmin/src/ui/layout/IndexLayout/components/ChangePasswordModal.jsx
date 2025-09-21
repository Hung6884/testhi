import { Modal, Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'umi';
import useIntl from '../../../hook/useIntl';

const ChangePasswordModal = ({ visible, onCancel, settings }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const res = await dispatch({
        type: 'Users/changePassword',
        payload: values,
      });

      if (res) {
        dispatch({
          type: 'notification/createNotification',
          payload: {
            type: 'success',
            message: formatMessage({
              id: 'page.user.changePassword.success.redirect',
            }),
          },
        });
        handleCancel();
        //set timeout 3s
        setTimeout(() => {
          dispatch({ type: 'User/logout', payload: settings });
        }, 3000);
      }
    } catch (error) {
      message.error(formatMessage({ id: 'page.user.changePassword.error' }));
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (rule, value) => {
    if (!value) {
      return Promise.reject();
    }

    if (value.length < 12) {
      return Promise.reject(
        formatMessage({ id: 'page.user.register.form-item-password.min' }),
      );
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasDigit = /[0-9]/.test(value);
    const hasSpecialChar = /[`~!@#$%^&*()_+\-={}|\\"';'<>?,./]/.test(value);

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
  };

  return (
    <Modal
      title={formatMessage({ id: 'user.button.changePassword' })}
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleChangePassword}>
        <Form.Item
          name="password"
          label={formatMessage({ id: 'page.user.currentPassword' })}
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'page.user.register.form-item-password.required',
              }),
            },
          ]}
        >
          <Input.Password
            placeholder={formatMessage({
              id: 'input.placeholder.type',
            })}
          />
        </Form.Item>

        <Form.Item
          name="new_password"
          label={formatMessage({ id: 'page.user.newPassword' })}
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'page.user.register.form-item-password.required',
              }),
            },
            { validator: validatePassword },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') !== value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    formatMessage({
                      id: 'page.user.changePassword.form-item-password.mismatch',
                    }),
                  ),
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder={formatMessage({
              id: 'input.placeholder.type',
            })}
          />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label={formatMessage({ id: 'page.user.confirmPassword' })}
          dependencies={['new_password']}
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'page.user.register.form-item-password.required',
              }),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    formatMessage({
                      id: 'page.user.changePassword.form-item-password.mismatch',
                    }),
                  ),
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder={formatMessage({
              id: 'input.placeholder.type',
            })}
          />
        </Form.Item>

        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            {formatMessage({ id: 'button.cancel' })}
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {formatMessage({ id: 'button.submit' })}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
