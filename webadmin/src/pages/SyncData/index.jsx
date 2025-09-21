import { PageContainer } from '@ant-design/pro-components';
import { useState } from 'react';
import SyncCourse from './components/SyncCourse';
import { formatMessage } from 'umi';
import SyncTeacher from './components/SyncTeacher';
import SyncTrainingVehicle from './components/SyncTrainingVehicle';

const SyncData = (props) => {
  const tabs = [
    {
      key: '1',
      tab: formatMessage({ id: 'sync.table.course' }),
      children: <SyncCourse />,
    },
    {
      key: '2',
      tab: formatMessage({ id: 'sync.table.teacher' }),
      children: <SyncTeacher />,
    },
    {
      key: '3',
      tab: formatMessage({ id: 'sync.table.vehicle' }),
      children: <SyncTrainingVehicle />,
    },
  ];
  return (
    <PageContainer
      className="indexlayout-main-content"
      tabList={tabs}
      tabProps={{
        className: 'ant-custom-tab',
        size: 'small',
        type: 'card',
        hideAdd: true,
      }}
    />
  );
};

export default SyncData;
