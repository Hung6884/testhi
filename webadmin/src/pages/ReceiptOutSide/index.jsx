import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Table, Typography, Tag, message } from 'antd';
import moment from 'moment';
import { getReceiptList } from '../DebtManagement/service/be.api';

const { RangePicker } = DatePicker;
const { Text } = Typography;

// Trạng thái thanh toán
const PAYMENT_LIST = [
  { value: '', label: '[--Tất cả--]' },
  { value: 'UNPAID', label: 'Chưa thanh toán' },
  { value: 'PAID', label: 'Đã thanh toán' },
  { value: 'PARTPAY', label: 'Thanh toán dở' },
];

// Loại khách
const PET_LIST = [
  { value: '', label: '[--Tất cả--]' },
  { value: 'NO', label: 'Khách in chuyển nhiệt' },
  { value: 'YES', label: 'Khách in PET' },
];

const VND = (n) =>
  (Number(n) || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

export default function ReceiptList() {
  const [form] = Form.useForm();

  // params = this.params
  const [params, setParams] = useState({
    customerName: undefined,
    createdByName: undefined,
    paymentStatus: '',
    isPet: '',
    fromCreatedAt: null,
    toCreatedAt:   null,
  });

  // table state
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // quyền (mock giống Angular abstract; nối auth thật sau)
  const isPetAccountant = useMemo(() => false, []);

  // ===== build body (port 1:1 từ addMoreBodyParams) =====
  const buildBody = (extra = {}) => {
    const body = { ...extra };

    if (params.customerName != null)   body.customerName   = params.customerName;
    if (params.createdByName != null)  body.createdByName  = params.createdByName;

    if (params.paymentStatus !== '' && params.paymentStatus != null) {
      body.paymentStatus = params.paymentStatus;
    }

    if (params.isPet !== '' && params.isPet != null) {
      if (params.isPet === 'YES') body.isPet = 'YES';
      if (params.isPet === 'NO')  body.isThernal = 'YES';
    }

    if (params.fromCreatedAt != null) body.fromCreatedAt = params.fromCreatedAt;
    if (params.toCreatedAt   != null) body.toCreatedAt   = params.toCreatedAt;

    if (isPetAccountant) body.isPet = 'YES';

    return body;
  };

  // ===== load list =====
  const loadData = async (page = pageNumber, size = pageSize) => {
    setLoading(true);
    try {
      const body = buildBody({ pageNumber: page, pageSize: size, isExportExcel: false });
      const resp = await getReceiptList(body);
      const data = resp?.data ?? resp ?? {};
      setRows(data.list ?? []);
      setCount(Number(data.count || 0));
      setPageNumber(page);
      setPageSize(size);
    } catch (e) {
      console.error(e);
      message.error('Tải danh sách phiếu thu thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(1, pageSize); /* eslint-disable-next-line */ }, []);

  // ===== columns =====
  const columns = useMemo(() => ([
    {
      title: 'STT',
      width: 64,
      align: 'center',
      render: (_v, _r, i) => (pageNumber - 1) * pageSize + i + 1,
      responsive: ['lg'],
    },
    { title: 'Mã khách hàng', dataIndex: ['customer', 'code'] },
    { title: 'Tên khách hàng', dataIndex: ['customer', 'name'] },
    {
      title: 'Giá trị phiếu thu',
      dataIndex: 'value',
      align: 'right',
      render: (v) => VND(v),
    },
    { title: 'Nội dung phiếu thu', dataIndex: 'content' },
    { title: 'Người tạo', dataIndex: ['createdBy', 'name'] },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'right',
      render: (v) => (v ? moment(v).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'paymentStatus',
      align: 'center',
      render: (v) => {
        const map = {
          PAID:    { color: 'green', text: 'Đã thanh toán' },
          UNPAID:  { color: 'red',   text: 'Chưa thanh toán' },
          PARTPAY: { color: 'gold',  text: 'Thanh toán dở' },
        };
        const s = map[v] || {};
        return <Tag color={s.color} style={{ width: 120, textAlign: 'center' }}>{s.text || ''}</Tag>;
      },
    },
    {
      title: '',
      key: 'action',
      width: 48,
      render: (_, r) => <span className="icon ion-ios-arrow-forward" />,
    },
  ]), [pageNumber, pageSize]);

  // ===== setters (port từ onSearch* + onSearchDate) =====
  const setInput = (k) => (e) =>
    setParams((p) => ({ ...p, [k]: e?.target?.value?.trim?.() ?? e?.target?.value ?? undefined }));

  const setSelect = (k) => (v) =>
    setParams((p) => ({ ...p, [k]: v ?? '' }));

  const setRangeMs = () => (val) => {
    if (val && val.length === 2) {
      setParams((p) => ({
        ...p,
        fromCreatedAt: moment(val[0]).startOf('day').valueOf(),
        toCreatedAt:   moment(val[1]).endOf('day').valueOf(),
      }));
    } else {
      setParams((p) => ({ ...p, fromCreatedAt: null, toCreatedAt: null }));
    }
  };

  // ===== row click: vào chi tiết =====
  const gotoDetail = (record) => {
    window.location.href = `/chi-tiet-phieu-thu-ngoai/${record?.id}`;
  };

  return (
    <Card title="Danh sách phiếu thu ngoài" bordered={false}>
      {/* FILTER */}
      <Form form={form} layout="vertical" onFinish={() => loadData(1, pageSize)}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Khách hàng">
              <Input allowClear onChange={setInput('customerName')} placeholder="Nhập tên khách hàng" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Người tạo phiếu">
              <Input allowClear onChange={setInput('createdByName')} placeholder="Nhập tên người tạo" />
            </Form.Item>
          </Col>

          {/* Loại khách hàng (ẩn nếu isPetAccountant) */}
          {!isPetAccountant && (
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label="Loại khách hàng">
                <Select options={PET_LIST} onChange={setSelect('isPet')} allowClear />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Trạng thái">
              <Select options={PAYMENT_LIST} onChange={setSelect('paymentStatus')} allowClear />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="Ngày tạo">
              <RangePicker onChange={setRangeMs()} format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Button type="primary" htmlType="submit">Tìm kiếm</Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                form.resetFields();
                setParams({
                  customerName: undefined,
                  createdByName: undefined,
                  paymentStatus: '',
                  isPet: '',
                  fromCreatedAt: null,
                  toCreatedAt: null,
                });
                loadData(1, pageSize);
              }}
            >
              Xóa lọc
            </Button>
          </Col>
        </Row>
      </Form>

      {/* TABLE */}
      <Card bodyStyle={{ padding: 0 }} style={{ marginTop: 8 }}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={rows}
          columns={columns}
          size="small"
          onRow={(record) => ({ onClick: () => gotoDetail(record), style: { cursor: 'pointer' } })}
          pagination={{
            current: pageNumber,
            pageSize,
            total: count,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, size) => loadData(page, size),
          }}
        />
      </Card>

      {/* Footer nhỏ cho biết tổng số bản ghi */}
      <div style={{ paddingTop: 10 }}>
        <Text type="secondary">Tổng số: {count.toLocaleString()}</Text>
      </div>
    </Card>
  );
}
