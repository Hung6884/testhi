import { GlobalOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space, Typography } from 'antd';
import classNames from 'classnames';
import { getLocale, setLocale } from 'umi';
import styles from './index.less';

export const SelectLang = (props) => {
  const { className } = props;
  const selectedLang = getLocale();

  // the second param will decide re-load the page or not.
  const changeLang = ({ key }) => setLocale(key, false);

  const locales = ['vi-VN', 'en-US', 'zh-CN'];
  const languageLabels = {
    'vi-VN': 'Tiếng Việt',
    'en-US': 'English',
    'zh-CN': '中文',
  };
  const languageIcons = {
    'vi-VN': 'VN',
    'en-US': 'EN',
    'zh-CN': 'CN',
  };

  const langMenu = (
    <Menu
      className={styles.menu}
      selectedKeys={selectedLang}
      onClick={changeLang}
    >
      {locales.map((locale) => (
        <Menu.Item key={locale}>{languageLabels[locale]}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={langMenu}>
      <span className={classNames(styles.dropDown, className)}>
        <Space>
          <Typography.Text
            style={{
              wordBreak: 'keep-all',
            }}
          >
            {languageIcons[selectedLang]}
          </Typography.Text>
          <GlobalOutlined title="Language" />
        </Space>
      </span>
    </Dropdown>
  );
};
