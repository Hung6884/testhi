import { useIntl as useUmiIntl } from 'umi';

function useIntl() {
  const { formatMessage } = useUmiIntl();

  return {
    formatMessage: (props) => {
      if (props.id) {
        return formatMessage({ id: props.id }, props.values);
      }

      return props.id;
    },
  };
}

export default useIntl;
