import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Table, Typography, message } from 'antd';
import moment from 'moment';
import { getListDirectOrders, getSumaryPriceDirect } from '../../DebtManagement/service/be.api';

const { RangePicker } = DatePicker;
const { Text } = Typography;

/** Payment labels */
const PAYMENT_LABEL = {
  UNPAID: 'Chưa thanh toán',
  PARTPAY: 'Thanh toán dở',
  PAID: 'Đã thanh toán',
};
const paymentOptions = [
  { value: null, label: '[--Tất cả--]' },
  { value: 'UNPAID', label: PAYMENT_LABEL.UNPAID },
  { value: 'PARTPAY', label: PAYMENT_LABEL.PARTPAY },
  { value: 'PAID', label: PAYMENT_LABEL.PAID },
];

/** Status options */
const statusOptions = [{ value: 'COMPLETE', label: 'Đã hoàn thành' }];

/** Pattern options */
const patternOptions = [
  { value: null, label: '[--Tất cả--]' },
  { value: 'YES', label: 'Dùng mẫu tổ vẽ' },
  { value: 'NO', label: 'Dùng mẫu ngoài' },
];

export default function RevenueDirect() {
  const [form] = Form.useForm();

  // params
  const [params, setParams] = useState({
    code: undefined,
    orderCode: undefined,
    customerCode: undefined,
    customerName: undefined,
    painterName: undefined,
    salerName: undefined,
    colorTesterName: undefined,

    status: null,
    paymentStatus: null,
    isPattern: null,

    fromCompletedTime: null,
    toCompletedTime: null,
    fromCreatedTime: null,
    toCreatedTime: null,
  });

  // table state
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // summary
  const [totalPrice, setTotalPrice] = useState(0);

  // quyền (mock, nối auth thực tế sau)
  const isAdmin = () => true;
  const isSubAdmin = () => true;
  const isAccountant = () => true;
  const isSaleManager = () => true;

  // chuẩn body
  const buildBody = (extra = {}) => {
    const body = { ...extra };

    // text filters
    ['code', 'orderCode', 'customerCode', 'customerName', 'painterName', 'salerName', 'colorTesterName'].forEach((k) => {
      const v = params[k];
      if (v != null && v !== '') body[k] = String(v).trim();
    });

    // status
    if (params.status && params.status !== 'null') {
      body.lstStatus = [params.status];
    } else {
      body.lstStatus = ['DELIVERED']; // giống Angular fallback
    }

    // payment
    if (params.paymentStatus != null && params.paymentStatus !== 'null') {
      body.paymentStatus = params.paymentStatus;
    }

    // pattern
    if (params.isPattern != null && params.isPattern !== 'null') {
      body.isPattern = params.isPattern;
    }

    // time ranges
    ['fromCompletedTime', 'toCompletedTime', 'fromCreatedTime', 'toCreatedTime'].forEach((k) => {
      if (params[k] != null) body[k] = params[k];
    });

    // soft delete
    body.isDelete = 'NO';

    return body;
  };

  const loadData = async (page = pageNumber, size = pageSize) => {
    setLoading(true);
    try {
      const base = { pageNumber: page, pageSize: size };
      const body = buildBody(base);

      const listResp = await getListDirectOrders(body);
      setRows(listResp?.list || []);
      setCount(listResp?.count || 0);
      setPageNumber(page);
      setPageSize(size);

      const sumResp = await getSumaryPriceDirect(body);
      setTotalPrice(Number(sumResp || 0));
    } catch (e) {
      console.error(e);
      message.error('Tải dữ liệu thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // columns
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
      { title: 'Số lượng ép', dataIndex: 'printedQuantity', align: 'right' },
    ];

    if (isAdmin() || isSubAdmin() || isAccountant() || isSaleManager()) {
      cols.push({
        title: 'Đơn giá',
        dataIndex: 'price',
        align: 'right',
        render: (v) => (v != null ? Number(v).toLocaleString() : ''),
      });
      cols.push({
        title: 'Thành tiền',
        key: 'amount',
        align: 'right',
        render: (_, r) => {
          const q = Number(r?.printedQuantity || 0);
          const p = Number(r?.price || 0);
          return (q * p).toLocaleString();
        },
      });
    }

    cols.push({
      title: 'Ngày hoàn thành',
      dataIndex: 'deliveryTimeEnd',
      align: 'right',
      render: (v) => (v ? moment(v).format('DD/MM/YYYY') : ''),
    });

    cols.push({
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      align: 'center',
      render: (v) => PAYMENT_LABEL[v] || '',
    });

    return cols;
  }, [pageNumber, pageSize]);

  // set helpers
  const setInput = (k) => (e) =>
    setParams((p) => ({ ...p, [k]: e?.target?.value?.trim?.() ?? e?.target?.value ?? undefined }));
  const setSelect = (k) => (v) => setParams((p) => ({ ...p, [k]: v }));
  const setRangeMs = (fromKey, toKey) => (val) => {
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
    <Card title="Doanh thu in trực tiếp" bordered={false}>
      {/* FILTER */}
      <Form form={form} layout="vertical" onFinish={() => loadData(1, pageSize)}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Mã lệnh"><Input allowClear onChange={setInput('code')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Mã đơn hàng"><Input allowClear onChange={setInput('orderCode')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Mã khách hàng"><Input allowClear onChange={setInput('customerCode')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Tên khách hàng"><Input allowClear onChange={setInput('customerName')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Người vẽ mẫu"><Input allowClear onChange={setInput('painterName')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Nhân viên kinh doanh"><Input allowClear onChange={setInput('salerName')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Nhân viên test màu"><Input allowClear onChange={setInput('colorTesterName')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Trạng thái lệnh">
              <Select options={statusOptions} onChange={setSelect('status')} allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Trạng thái thanh toán">
              <Select options={paymentOptions} onChange={setSelect('paymentStatus')} allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Thời gian hoàn thành">
              <RangePicker onChange={setRangeMs('fromCompletedTime', 'toCompletedTime')} format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Thời gian tạo lệnh">
              <RangePicker onChange={setRangeMs('fromCreatedTime', 'toCreatedTime')} format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Loại mẫu vẽ">
              <Select options={patternOptions} onChange={setSelect('isPattern')} allowClear />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Button type="primary" htmlType="submit">Tìm kiếm</Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                form.resetFields();
                setParams({
                  code: undefined,
                  orderCode: undefined,
                  customerCode: undefined,
                  customerName: undefined,
                  painterName: undefined,
                  salerName: undefined,
                  colorTesterName: undefined,
                  status: null,
                  paymentStatus: null,
                  isPattern: null,
                  fromCompletedTime: null,
                  toCompletedTime: null,
                  fromCreatedTime: null,
                  toCreatedTime: null,
                });
                loadData(1, pageSize);
              }}
            >
              Xóa lọc
            </Button>
          </Col>
        </Row>
      </Form>

      {/* SUMMARY */}
      {(isAdmin() || isSubAdmin() || isAccountant() || isSaleManager()) && (
        <div style={{ padding: '10px 5px 0' }}>
          <Text><b>Tổng:</b> {totalPrice.toLocaleString()}</Text>
        </div>
      )}

      {/* TABLE */}
      <Card bodyStyle={{ padding: 0 }} style={{ marginTop: 8 }}>
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
        />
      </Card>
    </Card>
  );
}
