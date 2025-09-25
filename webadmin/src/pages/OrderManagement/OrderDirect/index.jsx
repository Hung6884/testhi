import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Table, Tag, Typography, message } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './index.less';

import { getListDirectOrders } from '../../DebtManagement/service/be.api';
import { getDirectPriceSummary } from '../../DebtManagement/service/ar.api';

const { RangePicker } = DatePicker;
const { Text } = Typography;

/** ---- labels ---- */
const STATUS_LABEL = {
  CREATED: 'Chưa duyệt lệnh',
  APPROVAL: 'Chưa hồ',
  SIZED: 'Chưa in',
  PRINTING: 'Đang in dở',
  COMPLETE: 'Hoàn thành in',
  DELIVERING: 'Đang giao hàng',
  DELIVERED: 'Đã giao hàng',
};
const STATUS_TAG = {
  CREATED: 'default',
  APPROVAL: 'cyan',
  SIZED: 'geekblue',
  PRINTING: 'processing',
  COMPLETE: 'green',
  DELIVERING: 'purple',
  DELIVERED: 'blue',
};
const PAYMENT_LABEL = { UNPAID: 'Chưa thanh toán', PARTPAY: 'Thanh toán dở', PAID: 'Đã thanh toán' };
const PAYMENT_TAG = { UNPAID: 'error', PARTPAY: 'warning', PAID: 'success' };

/** ---- options ---- */
const statusOptions = [
  { value: null, label: '[--Tất cả--]', idToSend: null },
  { value: 'CREATED',   label: STATUS_LABEL.CREATED,   idToSend: 0 },
  { value: 'APPROVAL',  label: STATUS_LABEL.APPROVAL,  idToSend: 1 },
  { value: 'SIZED',     label: STATUS_LABEL.SIZED,     idToSend: 2 },
  // { value: 'PRINTING',  label: STATUS_LABEL.PRINTING,  idToSend: 3 },
  { value: 'COMPLETE',  label: STATUS_LABEL.COMPLETE,  idToSend: 4 },
  { value: 'DELIVERED', label: STATUS_LABEL.DELIVERED, idToSend: 5 },
];
const paymentOptions = [
  { value: null, label: '[--Tất cả--]' },
  { value: 'UNPAID', label: PAYMENT_LABEL.UNPAID },
  { value: 'PARTPAY', label: PAYMENT_LABEL.PARTPAY },
  { value: 'PAID', label: PAYMENT_LABEL.PAID },
];
const beingProducedOptions = [
  { value: null, label: '[--Tất cả--]' },
  { value: 'ALL', label: 'Hiển thị các lệnh đang sản xuất' },
];

export default function OrderDirect() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // params tương đương Angular
  const [params, setParams] = useState({
    code: undefined,
    orderCode: undefined,
    customerName: undefined,
    customerCode: undefined,
    painterName: undefined,
    salerName: undefined,
    colorTesterName: undefined,

    status: null,
    paymentStatus: null,
    listBeingProduced: null,

    fromOrderTime: null,
    toOrderTime: null,
    fromCreatedTime: null,
    toCreatedTime: null,
  });

  // table state
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // dashboard summary
  const [summary, setSummary] = useState({
    totalPrice: 0,
    totalQuantity: 0,
    lstSumQuantity: [],
    sumPrintedMd: 0,
    printedCount: 0,
  });

  // quyền – mock (giữ đúng behavior UI cũ)
  const isAdmin = () => true;
  const isSubAdmin = () => true;
  const isAccountant = () => true;
  const isSaleManager = () => true;

  // build body gửi BE (clone logic Angular)
  const buildBody = (extra = {}) => {
    const body = { ...extra };

    [
      'code','orderCode','customerName','customerCode',
      'painterName','salerName','colorTesterName',
    ].forEach((k) => {
      const v = params[k];
      if (v != null && v !== '') body[k] = String(v).trim();
    });

    ['fromOrderTime','toOrderTime','fromCreatedTime','toCreatedTime'].forEach((k) => {
      if (params[k] != null) body[k] = params[k];
    });

    if (params.paymentStatus != null && params.paymentStatus !== 'null') {
      body.paymentStatus = params.paymentStatus;
    }

    if (params.listBeingProduced != null && params.listBeingProduced !== 'null') {
      body.listBeingProduced = ['CREATED','APPROVAL','SIZED','PRINTING','COMPLETE'];
      body.lstStatus = ['CREATED','APPROVAL','SIZED','PRINTING','COMPLETE'];
    } else {
      body.listBeingProduced = [];
      body.lstStatus = [];
    }

    if (params.status !== null && params.status !== 'null') {
      body.lstStatus = [params.status];
      const found = statusOptions.find((x) => x.value === params.status);
      body.cStatus = found && typeof found.idToSend === 'number' ? found.idToSend : null;
    } else {
      body.cStatus = null;
      if (params.listBeingProduced != null && params.listBeingProduced !== 'null') {
        body.lstStatus = ['CREATED','APPROVAL','SIZED','PRINTING','COMPLETE'];
      }
    }

    body.deleteStatus = 'NO';
    return body;
  };

  const loadData = async (page = pageNumber, size = pageSize) => {
    setLoading(true);
    try {
      const base = { pageNumber: page, pageSize: size };
      const body = buildBody(base);

      // 1) list
      const listResp = await getListDirectOrders(body);
      setRows(listResp?.list || []);
      setCount(listResp?.count || 0);
      setPageNumber(page);
      setPageSize(size);

      // 2) summary (đã gộp)
      const sum = await getDirectPriceSummary(body);
      setSummary({
        totalPrice: Number(sum?.totalPrice) || 0,
        totalQuantity: Number(sum?.totalQuantity) || 0,
        lstSumQuantity: Array.isArray(sum?.lstSumQuantity) ? sum.lstSumQuantity : [],
        sumPrintedMd: Number(sum?.totalPrintedMd) || 0,
        printedCount: Number(sum?.printedCount) || 0,
      });
    } catch (e) {
      console.error(e);
      message.error('Tải dữ liệu thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(() => {
    const cols = [
      {
        title: 'STT',
        width: 64,
        align: 'center',
        render: (_v, _r, i) => (pageNumber - 1) * pageSize + i + 1,
        responsive: ['lg'],
      },
      { title: 'Lệnh sản xuất', dataIndex: 'code' },
      { title: 'Mã đơn hàng', dataIndex: 'orderCode' },
      { title: 'Khách hàng', dataIndex: ['customer', 'name'] },
      { title: 'Tên mẫu', dataIndex: 'style' },
    ];

    if (isAdmin() || isSubAdmin() || isAccountant()) {
      cols.push({
        title: 'Đơn giá',
        dataIndex: 'price',
        align: 'right',
        render: (v) => (v != null ? Number(v).toLocaleString() : ''),
      });
    }

    cols.push(
      { title: 'Số lượng', dataIndex: 'quantity', align: 'right' },
      {
        title: 'Số lượng md in thực tế',
        dataIndex: 'printedQuantity',
        align: 'right',
        render: (v) => (v == null ? 0 : v),
      },
      {
        title: 'Ngày đặt hàng',
        dataIndex: 'orderedTime',
        align: 'right',
        render: (v) => (v ? moment(v).format('DD/MM/YYYY') : ''),
      },
      { title: 'Thời gian ra mẫu', dataIndex: 'timeProcessing', align: 'right' },
      {
        title: 'Trạng thái sx',
        dataIndex: 'status',
        align: 'center',
        render: (s) => <Tag color={STATUS_TAG[s]}>{STATUS_LABEL[s]}</Tag>,
      }
    );

    if (isAdmin() || isAccountant()) {
      cols.push({
        title: 'Trạng thái thanh toán',
        dataIndex: 'paymentStatus',
        align: 'center',
        render: (p) => (p ? <Tag color={PAYMENT_TAG[p]}>{PAYMENT_LABEL[p]}</Tag> : null),
      });
    }

    // Nếu muốn mở chi tiết khi click:
    // cols.push({
    //   title: '',
    //   key: 'action',
    //   width: 48,
    //   align: 'center',
    //   render: (_v, record) => (
    //     <Button type="link" onClick={(e) => { e.stopPropagation(); navigate(`/orderManagement/orderDirect/${record.id}`); }}>
    //       →
    //     </Button>
    //   ),
    // });

    return cols;
  }, [pageNumber, pageSize]);

  // helpers set param
  const setInput = (k) => (e) =>
    setParams((p) => ({ ...p, [k]: e?.target?.value?.trim?.() ?? e?.target?.value ?? undefined }));
  const setSelect = (k) => (v) => setParams((p) => ({ ...p, [k]: v }));
  const setRange = (fromKey, toKey) => (val) => {
    if (val && val.length === 2) {
      setParams((p) => ({
        ...p,
        [fromKey]: moment(val[0]).startOf('day').valueOf(),
        [toKey]: moment(val[1]).endOf('day').valueOf(),
      }));
    } else {
      setParams((p) => ({ ...p, [fromKey]: null, [toKey]: null }));
    }
  };

  return (
    <Card title="Đơn hàng In trực tiếp" bordered={false}>
      {/* FILTER */}
      <Form form={form} layout="vertical" onFinish={() => loadData(1, pageSize)}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Mã lệnh"><Input allowClear onChange={setInput('code')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Mã đơn hàng"><Input allowClear onChange={setInput('orderCode')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Khách hàng"><Input allowClear onChange={setInput('customerName')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Mã khách hàng"><Input allowClear onChange={setInput('customerCode')} /></Form.Item></Col>

          <Col xs={24} sm={12} lg={6}><Form.Item label="Người vẽ mẫu"><Input allowClear onChange={setInput('painterName')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Nhân viên kinh doanh"><Input allowClear onChange={setInput('salerName')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Nhân viên test màu"><Input allowClear onChange={setInput('colorTesterName')} /></Form.Item></Col>

          <Col xs={24} sm={12} lg={6}><Form.Item label="Trạng thái lệnh"><Select options={statusOptions} onChange={setSelect('status')} allowClear /></Form.Item></Col>
          {(isAdmin() || isAccountant()) && (
            <Col xs={24} sm={12} lg={6}><Form.Item label="Trạng thái thanh toán"><Select options={paymentOptions} onChange={setSelect('paymentStatus')} allowClear /></Form.Item></Col>
          )}
          <Col xs={24} sm={12} lg={6}><Form.Item label="Tổng hợp lệnh đang sản xuất"><Select options={beingProducedOptions} onChange={setSelect('listBeingProduced')} allowClear /></Form.Item></Col>

          <Col xs={24} sm={12} lg={6}><Form.Item label="Thời gian khách đặt"><RangePicker onChange={setRange('fromOrderTime','toOrderTime')} format="DD/MM/YYYY" style={{ width: '100%' }} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Thời gian tạo lệnh"><RangePicker onChange={setRange('fromCreatedTime','toCreatedTime')} format="DD/MM/YYYY" style={{ width: '100%' }} /></Form.Item></Col>

          <Col xs={24}>
            <Button type="primary" htmlType="submit">Tìm kiếm</Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                form.resetFields();
                setParams({
                  code: undefined, orderCode: undefined, customerName: undefined, customerCode: undefined,
                  painterName: undefined, salerName: undefined, colorTesterName: undefined,
                  status: null, paymentStatus: null, listBeingProduced: null,
                  fromOrderTime: null, toOrderTime: null, fromCreatedTime: null, toCreatedTime: null,
                });
                loadData(1, pageSize);
              }}
            >
              Xóa lọc
            </Button>
          </Col>
        </Row>
      </Form>

      {/* DASHBOARD */}
      {(isAccountant() || isAdmin() || isSaleManager()) && (
        <>
          <div style={{ padding: '8px 5px' }}>
            <Text style={{ paddingRight: 12 }}>Tổng số lệnh: {count}</Text>
            {(isAdmin() || isSaleManager()) && (
              <>
                <Text style={{ paddingRight: 12 }}>Số lượng: </Text>
                {summary.lstSumQuantity.map((it) => (
                  <Text key={it.name} style={{ paddingRight: 8 }}>
                    {it.sumQuantity} {it.name},
                  </Text>
                ))}
              </>
            )}
          </div>

          {isAdmin() && (
            <div style={{ padding: '0 5px 8px' }}>
              <Text>Số lượng md in thực tế: {summary.sumPrintedMd} md</Text>
            </div>
          )}

          {(isAdmin() || isSaleManager()) && (
            <div style={{ padding: '0 5px 8px' }}>
              <Text>Tổng đơn hàng đã in: {summary.printedCount}</Text>
            </div>
          )}
        </>
      )}

      {/* TABLE */}
      <Card bodyStyle={{ padding: 0 }}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={rows}
          columns={columns}
          size="small"
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            total: count,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, size) => loadData(page, size),
          }}
          // onRow={(record) => ({
          //   onClick: () => navigate(`/orderManagement/orderDirect/${record.id}`),
          // })}
        />
      </Card>
    </Card>
  );
}
