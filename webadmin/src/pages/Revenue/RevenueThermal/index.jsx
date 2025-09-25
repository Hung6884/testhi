// src/pages/OrderThermal/index.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Table, Tag, Typography, message } from 'antd';
import moment from 'moment';
import { getListProductionOrders, getThermalPriceSummary } from '../../DebtManagement/service/be.api';
import './index.less';

const { RangePicker } = DatePicker;
const { Text } = Typography;

/** select options */
const statusOptions = [
  { value: 'EXTRACTED', label: 'Đã ép xong' },
  { value: 'COMPLETE',  label: 'Đã hoàn thành' },
];

const paymentOptions = [
  { value: null,       label: '[--Tất cả--]' },
  { value: 'UNPAID',   label: 'Chưa thanh toán' },
  { value: 'PARTPAY',  label: 'Thanh toán dở' },
  { value: 'PAID',     label: 'Đã thanh toán' },
];

const patternOptions = [
  { value: null, label: '[--Tất cả--]' },
  { value: 'YES', label: 'Dùng mẫu tổ vẽ' },
  { value: 'NO',  label: 'Dùng mẫu ngoài' },
];

const PAYMENT_TAG = { UNPAID: 'error', PARTPAY: 'warning', PAID: 'success' };
const PAYMENT_LABEL = { UNPAID: 'Chưa thanh toán', PARTPAY: 'Thanh toán dở', PAID: 'Đã thanh toán' };

export default function OrderThermal() {
  const [form] = Form.useForm();

  const [params, setParams] = useState({
    code: undefined,
    orderCode: undefined,
    customerCode: undefined,
    customerName: undefined,
    painterName: undefined,
    salerName: undefined,
    colorTesterName: undefined,

    status: undefined,           // nếu bỏ trống => dùng mặc định ['EXTRACTED','COMPLETE']
    paymentStatus: null,
    isPattern: null,

    fromDeliverTimeEnd: null,
    toDeliverTimeEnd: null,
    fromCreatedTime: null,
    toCreatedTime: null,
  });

  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [totalPrice, setTotalPrice] = useState(0);

  const isAdmin = () => true;
  const isSubAdmin = () => true;
  const isAccountant = () => true;
  const isSaleManager = () => true;

  /** body giống addMoreBodyParams bên Angular */
  const buildBody = (base = {}) => {
    const body = { ...base };

    [
      'code','orderCode','customerCode','customerName',
      'painterName','salerName','colorTesterName'
    ].forEach(k => {
      const v = params[k];
      if (v != null && v !== '') body[k] = String(v).trim();
    });

    // ranges
    ['fromDeliverTimeEnd','toDeliverTimeEnd','fromCreatedTime','toCreatedTime'].forEach(k => {
      if (params[k] != null) body[k] = params[k];
    });

    if (params.paymentStatus != null && params.paymentStatus !== 'null') {
      body.paymentStatus = params.paymentStatus;
    }
    if (params.isPattern != null && params.isPattern !== 'null') {
      body.isPattern = params.isPattern;
    }

    if (params.status != null && params.status !== 'null' && params.status !== '') {
      body.lstStatus = [params.status];
    } else {
      body.lstStatus = ['EXTRACTED', 'COMPLETE'];
    }

    body.deleteStatus = 'NO';
    return body;
  };

  const loadData = async (page = pageNumber, size = pageSize) => {
    setLoading(true);
    try {
      const base = { pageNumber: page, pageSize: size };
      const body = buildBody(base);

      const listResp = await getListProductionOrders(body);
      setRows(listResp?.list || []);
      setCount(listResp?.count || 0);
      setPageNumber(page);
      setPageSize(size);

      // total price
      const priceResp = await getThermalPriceSummary(body);
      setTotalPrice(priceResp ?? 0);
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
      { title: 'Số lượng ép', dataIndex: 'extractedQuantity', align: 'right' },
    ];

    if (isAdmin() || isSubAdmin() || isAccountant() || isSaleManager()) {
      cols.push(
        {
          title: 'Đơn giá',
          dataIndex: 'price',
          align: 'right',
          render: (v) => (v != null ? Number(v).toLocaleString() : ''),
        },
        {
          title: 'Thành tiền',
          key: 'amount',
          align: 'right',
          render: (_, r) => {
            const val = (Number(r.extractedQuantity) || 0) * (Number(r.price) || 0);
            return val.toLocaleString();
          },
        }
      );
    }

    cols.push(
      {
        title: 'Ngày hoàn thành',
        dataIndex: 'deliveryTimeEnd',
        align: 'right',
        render: (v) => (v ? moment(v).format('DD/MM/YYYY') : ''),
      },
      {
        title: 'Trạng thái thanh toán',
        dataIndex: 'paymentStatus',
        align: 'center',
        render: (p) => (p ? <Tag color={PAYMENT_TAG[p]}>{PAYMENT_LABEL[p]}</Tag> : null),
      },
    );

    return cols;
  }, [pageNumber, pageSize]);

  // helpers đổi form input
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

  // export CSV đơn giản (client side)
  const exportCsv = async () => {
    try {
      const body = buildBody({ isExportExcel: true });
      const resp = await getThermalOrders(body); // backend trả list đầy đủ
      const list = resp?.list || [];
      const lines = [
        [
          'STT','Lệnh sản xuất','Mã đơn hàng','Khách hàng','Tên mẫu',
          'Số lượng ép','Đơn giá','Thành tiền','Ngày hoàn thành','Trạng thái thanh toán',
        ].join(','),
      ];
      list.forEach((it, idx) => {
        const amount = (Number(it.extractedQuantity)||0) * (Number(it.price)||0);
        lines.push([
          idx + 1,
          it.code ?? '',
          it.orderCode ?? '',
          it.customer?.name ?? '',
          it.style ?? '',
          it.extractedQuantity ?? '',
          it.price ?? '',
          amount,
          it.deliveryTimeEnd ? moment(it.deliveryTimeEnd).format('DD/MM/YYYY') : '',
          it.paymentStatus ?? '',
        ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(','));
      });
      // dòng tổng nếu có quyền
      if (isAccountant() || isSaleManager()) {
        lines.push(['','','','','','', 'Tổng', totalPrice, '', ''].map(v=>`"${v}"`).join(','));
      }
      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'doanh-thu-in-chuyen-nhiet.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      message.error('Xuất file thất bại');
    }
  };

  return (
    <Card title="Doanh thu in chuyển nhiệt" bordered={false}>
      {/* FILTER */}
      <Form form={form} layout="vertical" onFinish={() => loadData(1, pageSize)}>
        <Row gutter={[12,12]}>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Mã lệnh"><Input allowClear onChange={setInput('code')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Mã đơn hàng"><Input allowClear onChange={setInput('orderCode')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Mã khách hàng"><Input allowClear onChange={setInput('customerCode')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Tên khách hàng"><Input allowClear onChange={setInput('customerName')} /></Form.Item></Col>

          <Col xs={24} sm={12} lg={6}><Form.Item label="Người vẽ mẫu"><Input allowClear onChange={setInput('painterName')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Nhân viên kinh doanh"><Input allowClear onChange={setInput('salerName')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Nhân viên test màu"><Input allowClear onChange={setInput('colorTesterName')} /></Form.Item></Col>

          <Col xs={24} sm={12} lg={6}><Form.Item label="Trạng thái lệnh"><Select allowClear options={statusOptions} onChange={setSelect('status')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Trạng thái thanh toán"><Select allowClear options={paymentOptions} onChange={setSelect('paymentStatus')} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Loại mẫu vẽ"><Select allowClear options={patternOptions} onChange={setSelect('isPattern')} /></Form.Item></Col>

          <Col xs={24} sm={12} lg={6}><Form.Item label="Thời gian hoàn thành"><RangePicker onChange={setRange('fromDeliverTimeEnd','toDeliverTimeEnd')} format="DD/MM/YYYY" style={{ width: '100%' }} /></Form.Item></Col>
          <Col xs={24} sm={12} lg={6}><Form.Item label="Thời gian tạo lệnh"><RangePicker onChange={setRange('fromCreatedTime','toCreatedTime')} format="DD/MM/YYYY" style={{ width: '100%' }} /></Form.Item></Col>

          <Col xs={24}>
            <Button type="primary" htmlType="submit">Tìm kiếm</Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                form.resetFields();
                setParams({
                  code: undefined, orderCode: undefined, customerCode: undefined, customerName: undefined,
                  painterName: undefined, salerName: undefined, colorTesterName: undefined,
                  status: undefined, paymentStatus: null, isPattern: null,
                  fromDeliverTimeEnd: null, toDeliverTimeEnd: null, fromCreatedTime: null, toCreatedTime: null,
                });
                loadData(1, pageSize);
              }}
            >
              Xóa lọc
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={exportCsv}>Xuất file</Button>
          </Col>
        </Row>
      </Form>

      {/* DASHBOARD nhỏ (tổng tiền) */}
      {(isAdmin() || isSubAdmin() || isAccountant() || isSaleManager()) && (
        <div style={{ padding: '8px 5px' }}>
          <Text style={{ paddingRight: 12 }}>Tổng: <b>{Number(totalPrice).toLocaleString()}</b></Text>
        </div>
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
            pageSize,
            total: count,
            showSizeChanger: true,
            pageSizeOptions: ['10','20','50','100'],
            onChange: (p, s) => loadData(p, s),
          }}
        />
      </Card>
    </Card>
  );
}
