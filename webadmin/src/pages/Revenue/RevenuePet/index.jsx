import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Table, Typography, message } from 'antd';
import moment from 'moment';
import { getListProductionOrdersPet, getPetSummary } from '../../DebtManagement/service/be.api';

const { RangePicker } = DatePicker;
const { Text } = Typography;

/** Payment labels/tags */
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

export default function PetCompleted() {
  const [form] = Form.useForm();

  // params (filter)
  const [params, setParams] = useState({
    code: undefined,
    orderCode: undefined,
    customerCode: undefined,
    customerName: undefined,

    fromOrderTime: null,
    toOrderTime: null,
    fromCreatedTime: null,
    toCreatedTime: null,

    fromDeliveryTime: null,
    toDeliveryTime: null,

    paymentStatus: null,
  });

  // table state
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // summary
  const [totalPrice, setTotalPrice] = useState(0);

  // quyền (mock như Angular—tùy bạn nối auth thực tế)
  const isAdmin = () => true;
  const isSubAdmin = () => true;
  const isAccountant = () => true;
  const isPetAccountant = () => true;
  const isSaleManager = () => true;

  // Chuẩn body giống Angular
  const buildBody = (extra = {}) => {
    const body = { ...extra };

    // text filters
    ['code', 'orderCode', 'customerCode', 'customerName'].forEach((k) => {
      const v = params[k];
      if (v != null && v !== '') body[k] = String(v).trim();
    });

    // time ranges
    [
      'fromOrderTime',
      'toOrderTime',
      'fromCreatedTime',
      'toCreatedTime',
      'fromDeliveryTime',
      'toDeliveryTime',
    ].forEach((k) => {
      if (params[k] != null) body[k] = params[k];
    });

    // payment
    if (params.paymentStatus != null && params.paymentStatus !== 'null') {
      body.paymentStatus = params.paymentStatus;
    }

    // bắt buộc chỉ lấy COMPLETE
    body.lstStatus = ['COMPLETE'];

    // xóa mềm = NO
    body.isDelete = 'NO';

    return body;
  };

  const loadData = async (page = pageNumber, size = pageSize) => {
    setLoading(true);
    try {
      const base = { pageNumber: page, pageSize: size };
      const body = buildBody(base);

      const listResp = await getListProductionOrdersPet(body);
      setRows(listResp?.list || []);
      setCount(listResp?.count || 0);
      setPageNumber(page);
      setPageSize(size);

      // total price (sumary)
      const sumResp = await getPetSummary(body);
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
      { title: 'Số lượng khách đặt', dataIndex: 'quantity', align: 'right' },
      { title: 'Số lượng giao hàng', dataIndex: 'deliveryQuantity', align: 'right' },
    ];

    if (isAdmin() || isSubAdmin() || isAccountant() || isPetAccountant() || isSaleManager()) {
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
          const q = Number(r?.deliveryQuantity || 0);
          const p = Number(r?.price || 0);
          return (q * p).toLocaleString();
        },
      });
    }

    cols.push(
      { title: 'Số lượng lỗi', dataIndex: 'defectiveQuantity', align: 'right' },
      {
        title: 'Ngày hoàn thành',
        dataIndex: 'deliveryTimeEnd',
        align: 'right',
        render: (v) => (v ? moment(v).format('DD/MM/YYYY') : ''),
      }
    );

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

  // export CSV đơn giản (bạn có thể thay bằng thư viện xlsx)
  const exportCsv = async () => {
    try {
      const body = buildBody({ isExportExcel: true });
      const resp = await getPetCompletedList(body);
      const list = resp?.list || [];

      const headers = [
        'id',
        'Mã sản xuất',
        'Mã đơn hàng',
        'Tên khách hàng',
        'Người vẽ mẫu',
        'Nhân viên kinh doanh',
        'Tài khoản tạo lệnh',
        'Ngày đặt hàng',
        'Kiểu mẫu vẽ',
        'Size',
        'Số lượng khách đặt',
        'Số lượng giao hàng',
        'Đơn giá',
        'Thành tiền',
        'Đơn vị tính',
        'Hình ảnh',
        'Trạng thái đơn hàng',
        'Trạng thái thanh toán',
      ];

      const rowsCsv = list.map((el) => {
        const ordered = el.orderedTime ? moment(el.orderedTime).format('DD/MM/YYYY') : '';
        const amount = Number(el.price || 0) * Number(el.deliveryQuantity || 0);
        return [
          el.id ?? '',
          el.code ?? '',
          el.orderCode ?? '',
          el.customer?.name ?? '',
          el.painter?.name ?? '',
          el.customer?.saler?.name ?? '',
          el.createdBy?.name ?? '',
          ordered,
          el.style ?? '',
          el.size ?? '',
          el.quantity ?? '',
          el.deliveryQuantity ?? '',
          el.price ?? '',
          amount,
          el.unit?.name ?? '',
          el.images ?? '',
          el.status ?? '',
          el.paymentStatus ?? '',
        ]
          .map((x) => `"${String(x).replace(/"/g, '""')}"`)
          .join(',');
      });

      const csv = [headers.join(','), ...rowsCsv].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'pet_completed.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      message.error('Xuất CSV thất bại');
    }
  };

  return (
    <Card title="Doanh thu bộ phận in PET" bordered={false}>
      {/* FILTER */}
      <Form form={form} layout="vertical" onFinish={() => loadData(1, pageSize)}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Mã lệnh">
              <Input allowClear onChange={setInput('code')} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Mã đơn hàng">
              <Input allowClear onChange={setInput('orderCode')} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Mã khách hàng">
              <Input allowClear onChange={setInput('customerCode')} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Tên khách hàng">
              <Input allowClear onChange={setInput('customerName')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Thời gian khách đặt">
              <RangePicker onChange={setRangeMs('fromOrderTime', 'toOrderTime')} format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Thời gian tạo lệnh">
              <RangePicker onChange={setRangeMs('fromCreatedTime', 'toCreatedTime')} format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Trạng thái thanh toán">
              <Select options={paymentOptions} onChange={setSelect('paymentStatus')} allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Thời gian hoàn thành">
              <RangePicker onChange={setRangeMs('fromDeliveryTime', 'toDeliveryTime')} format="DD/MM/YYYY" style={{ width: '100%' }} />
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
                  fromOrderTime: null,
                  toOrderTime: null,
                  fromCreatedTime: null,
                  toCreatedTime: null,
                  fromDeliveryTime: null,
                  toDeliveryTime: null,
                  paymentStatus: null,
                });
                loadData(1, pageSize);
              }}
            >
              Xóa lọc
            </Button>
            {(isAdmin() || isSubAdmin() || isAccountant() || isPetAccountant() || isSaleManager()) && (
              <Button style={{ marginLeft: 8 }} onClick={exportCsv}>Xuất file CSV</Button>
            )}
          </Col>
        </Row>
      </Form>

      {/* SUMMARY (dòng tổng) */}
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
          // onRow={(record) => ({
          //   onClick: () => navigate(`/orderManagement/petCompleted/${record.id}`),
          // })}
        />
      </Card>
    </Card>
  );
}
