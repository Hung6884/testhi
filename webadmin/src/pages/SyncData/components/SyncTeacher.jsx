import { ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'umi';
import './table-checkbox.less';
import moment from 'moment';
import { compareDiffByKeys } from '../../../utils/common';
const teacherFieldsToCompare = [
  'code',
  'name',
  'middleName',
  'birthday',
  'csdtCode',
  'cndtCode',
  'phone',
  'createdDate',
  'educationalLevelCode',
  'avatar',
  'nationalId',
  'drivingLicenseCategory',
  'isActive',
];
function generateListData(datas) {
  if (!datas) return false;
  const results = datas.map((item, index) => {
    const isDifferent = compareDiffByKeys(
      item,
      item.datTeacher,
      teacherFieldsToCompare,
    );
    return {
      key: `teacher-${index}-${item.code}`,
      title: `${index + 1}. ${item.fullName}`,
      code: item.code,
      isSync: item.isSync,
      isDifferent,
      fpt: {
        code: item.code,
        name: item.name,
        middleName: item.middleName,
        fullName: item.fullName,
        birthday: item.birthday,
        csdtCode: item.csdtCode,
        cndtCode: item.cndtCode,
        phone: item.phone,
        createdDate: item.createdDate,
        educationalLevelCode: item.educationalLevelCode,
        avatar: item.avatar,
        nationalId: item.nationalId,
        drivingLicenseCategory: item.drivingLicenseCategory,
        isActive: item.isActive,
      },
      dat: item.datTeacher || {},
    };
  });

  return results;
}

const SyncTeacher = ({ dispatch, loading, syncDataLoading }) => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const handleFetch = useCallback(async () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
    const res = await dispatch({
      type: 'SyncData/queryTableTeachers',
      payload: {},
    });
    setDataSource(generateListData(res.data));
  }, []);

  const buildPayload = () => {
    if (isEmpty(selectedRows)) {
      message.warning('Bạn phải chọn dữ liệu để đồng bộ');
      return;
    }

    return selectedRows.map((r) => r.fpt);
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const columns = [
    {
      title: (
        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>Danh mục</div>
      ),
      dataIndex: 'title',
      width: 300,
    },
    {
      title: (
        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Hệ thống FPT
        </div>
      ),
      children: [
        {
          dataIndex: ['fpt', 'name'],
          align: 'center',
          render: (_, record) => {
            const isDiff = record.fpt.fullName !== record.dat.fullName;
            return (
              <span style={{ color: isDiff ? 'red' : 'green' }}>
                {record.fpt.fullName}
              </span>
            );
          },
        },
        {
          dataIndex: ['fpt', 'drivingLicenseCategory'],
          align: 'center',
          render: (_, record) => {
            const isDiff =
              record.fpt.drivingLicenseCategory !==
              record.dat.drivingLicenseCategory;
            return (
              <span style={{ color: isDiff ? 'red' : 'green' }}>
                {record.fpt.drivingLicenseCategory}
              </span>
            );
          },
        },
      ],
    },
    {
      title: (
        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Hệ thống DAT
        </div>
      ),
      children: [
        {
          dataIndex: ['dat', 'name'],
          align: 'center',
          render: (_, record) => {
            const isDiff = record.fpt.fullName !== record.dat.fullName;
            return (
              <span style={{ color: isDiff ? 'red' : 'green' }}>
                {record.dat.fullName || '-'}
              </span>
            );
          },
        },
        {
          dataIndex: ['dat', 'drivingLicenseCategory'],
          align: 'center',
          render: (_, record) => {
            const isDiff =
              record.fpt.drivingLicenseCategory !==
              record.dat.drivingLicenseCategory;
            return (
              <span style={{ color: isDiff ? 'red' : 'green' }}>
                {record.dat.drivingLicenseCategory || '-'}
              </span>
            );
          },
        },
      ],
    },
    {
      title: <div style={{ fontWeight: 'bold' }}>Ghi chú</div>,
      dataIndex: 'note',
      align: 'center',
      render: (_, record) => {
        if (record.isDifferent) {
          return <span style={{ color: 'red' }}>Thông tin khác</span>;
        }
        return '';
      },
    },
  ];
  return (
    <>
      <div style={{ marginTop: 10 }}>
        <Button
          type="primary"
          loading={syncDataLoading}
          onClick={async () => {
            const payload = buildPayload(selectedRows);

            await dispatch({
              type: 'SyncData/syncTeachers',
              payload,
            });
            await handleFetch();
          }}
          disabled={selectedRows.length === 0}
        >
          Đồng bộ
        </Button>
      </div>
      <ProTable
        bordered
        columns={columns}
        search={false}
        options={false}
        pagination={true}
        dataSource={dataSource}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
            setSelectedRows(selectedRows);
          },
          renderCell: (_, record, index, originNode) => {
            if (!record.isDifferent) {
              return null; // hide checkbox cell completely
            }
            return originNode; // default checkbox
          },
        }}
        loading={loading}
        headerTitle="Danh sách Giáo viên"
        className="showCheckbox"
      />
      <div>
        <Button
          type="primary"
          loading={syncDataLoading}
          onClick={async () => {
            const payload = buildPayload(selectedRows);

            await dispatch({
              type: 'SyncData/syncTeachers',
              payload,
            });
            await handleFetch();
          }}
          disabled={selectedRows.length === 0}
        >
          Đồng bộ
        </Button>
      </div>
    </>
  );
};

export default connect(({ SyncData, loading }) => ({
  loading: loading.effects['SyncData/queryTableTeachers'],
  syncDataLoading: loading.effects['SyncData/syncTeachers'],
}))(SyncTeacher);
