import logo from '../../shared/images/logo-collapsed.png';
import { SelectLang } from '../../ui/component/SelectLang';
import FormRegister from './FormRegister';
import styles from './style.less';

const Register = () => {
  return (
    <div className={styles.container}>
      <SelectLang className={styles.langSelect} />
      <img alt="logo" src={logo} width="128" style={{ margin: '0px auto' }} />
      <div className={styles.main}>
        <FormRegister />
      </div>
    </div>
  );
};

export default Register;
