import { ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'umi';
import './table-checkbox.less';
import { compareDiffByKeys } from '../../../utils/common';
const trainingVehicleFieldsToCompare = [
  'code',
  'licensePlate',
  'csdtCode',
  'manufacturingYear',
  'licenseIssueDate',
  'createdDate',
  'licenseExpiryDate',
  'issuingAuthority',
  'registrationNumber',
  'licenseNumber',
  'drivingLicenseCategory',
  'isActive',
];

function generateListData(datas) {
  if (!datas) return false;
  const results = datas.map((item, index) => {
    const isDifferent = compareDiffByKeys(
      item,
      item.datTrainingVehicle,
      trainingVehicleFieldsToCompare,
    );
    return {
      key: `trainingVehicle-${index}-${item.code}`,
      title: `${index + 1}. ${item.code}`,
      code: item.code,
      isSync: item.isSync,
      isDifferent,
      fpt: {
        code: item.code,
        licensePlate: item.licensePlate,
        csdtCode: item.csdtCode,
        manufacturingYear: item.manufacturingYear,
        //createdDate: item.createdDate,
        licenseIssueDate: item.licenseIssueDate,
        licenseExpiryDate: item.licenseExpiryDate,
        issuingAuthority: item.issuingAuthority,
        registrationNumber: item.registrationNumber,
        licenseNumber: item.licenseNumber,
        drivingLicenseCategory: item.drivingLicenseCategory,
        isActive: item.isActive,
      },
      dat: item.datTrainingVehicle || {},
    };
  });

  return results;
}

const SyncTrainingVehicle = ({ dispatch, loading, syncDataLoading }) => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const handleFetch = useCallback(async () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
    const res = await dispatch({
      type: 'SyncData/queryTableTrainingVehicles',
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
          dataIndex: ['fpt', 'licensePlate'],
          align: 'center',
          render: (_, record) => {
            const isDiff = record.fpt.licensePlate !== record.dat.licensePlate;
            return (
              <span
                style={{ fontWeight: 'bold', color: isDiff ? 'red' : 'green' }}
              >
                {record.fpt.licensePlate}
              </span>
            );
          },
        },
        {
          dataIndex: ['fpt', 'drivingLicenseCategory'],
          render: (_, record) => {
            /*  const isDiff =
              record.fpt.drivingLicenseCategory !== record.dat.drivingLicenseCategory;
            return (
              <span style={{fontWeight: 'bold', color: isDiff ? 'red' : 'inherit' }}>
                {record.fpt.drivingLicenseCategory}
              </span>
            ); */
            return <span></span>;
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
          dataIndex: ['dat', 'licensePlate'],
          align: 'center',
          render: (_, record) => {
            const isDiff = record.fpt.licensePlate !== record.dat.licensePlate;
            return (
              <span
                style={{ fontWeight: 'bold', color: isDiff ? 'red' : 'green' }}
              >
                {record.dat.licensePlate || '-'}
              </span>
            );
          },
        },
        {
          dataIndex: ['dat', 'drivingLicenseCategory'],
          render: (_, record) => {
            /* const isDiff =
              record.fpt.drivingLicenseCategory !== record.dat.drivingLicenseCategory;
            return (
              <span style={{  fontWeight: 'bold',color: isDiff ? 'red' : 'inherit' }}>
                {record.dat.drivingLicenseCategory || '-'}
              </span>
            ); */
            return <span></span>;
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
              type: 'SyncData/syncTrainingVehicles',
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
        headerTitle="Danh sách Xe tập lái"
        className="showCheckbox"
      />
      <div>
        <Button
          type="primary"
          loading={syncDataLoading}
          onClick={async () => {
            const payload = buildPayload(selectedRows);

            await dispatch({
              type: 'SyncData/syncTrainingVehicles',
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
  loading: loading.effects['SyncData/queryTableTrainingVehicles'],
  syncDataLoading: loading.effects['SyncData/syncTrainingVehicles'],
}))(SyncTrainingVehicle);
