import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Table, Tag, Typography, message } from 'antd';
import moment from 'moment';
import './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

/** ---- labels (theo Angular) ---- */
const STATUS_LABEL = {
  CREATED: 'Chưa duyệt',
  APPROVAL: 'Chưa in',
  PRINTING: 'Đang in dở',
  PRINTED: 'Đã in xong',
  EXTRACTING: 'Đang ép dở',
  EXTRACTED: 'Đã ép xong',
  CUTTED: 'Đã cắt vải',
  DELIVERING: 'Đang giao hàng',
  COMPLETE: 'Đã giao hàng',
  ORDERED: 'Đã lên lệnh',
};
const STATUS_TAG = {
  CREATED: 'default',
  APPROVAL: 'cyan',
  PRINTING: 'processing',
  PRINTED: 'geekblue',
  EXTRACTING: 'orange',
  EXTRACTED: 'blue',
  CUTTED: 'purple',
  DELIVERING: 'magenta',
  COMPLETE: 'green',
  ORDERED: 'gold',
};
const PAYMENT_LABEL = { UNPAID: 'Chưa thanh toán', PARTPAY: 'Thanh toán dở', PAID: 'Đã thanh toán' };
const PAYMENT_TAG = { UNPAID: 'error', PARTPAY: 'warning', PAID: 'success' };

/** ---- options ---- */
const statusOptions = [
  { value: null, label: '[--Tất cả--]' },
  { value: 'CREATED', label: 'Chưa duyệt' },
  { value: 'APPROVAL', label: 'Chưa in' },
  { value: 'PRINTING', label: 'Đang in dở' },
  { value: 'PRINTED', label: 'Đã in xong' },
  { value: 'EXTRACTING', label: 'Đang ép dở' },
  { value: 'EXTRACTED', label: 'Đã ép xong' },
  { value: 'CUTTED', label: 'Đã cắt vải' },
  { value: 'DELIVERING', label: 'Đang giao hàng' },
  { value: 'COMPLETE', label: 'Đã giao hàng' },
  { value: 'ORDERED', label: 'Đã lên lệnh' },
];
const paymentOptions = [
  { value: null, label: '[--Tất cả--]' },
  { value: 'UNPAID', label: 'Chưa thanh toán' },
  { value: 'PARTPAY', label: 'Thanh toán dở' },
  { value: 'PAID', label: 'Đã thanh toán' },
];
const beingProducedOptions = [
  { value: null, label: '[--Tất cả--]' },
  { value: 'ALL', label: 'Hiển thị các lệnh đang sản xuất' },
];
const lstMachine = [
  { value: null, label: '[--Tất cả--]' },
  { value: '13', label: 'Máy in PET - 01' },
  { value: '14', label: 'Máy in PET - 02' },
  { value: '15', label: 'Máy in PET - 03' },
];

/**
 * Props:
 * - onFetchList:      (body:{}) => Promise<{list:any[], count:number}>
 * - onFetchTotalPrice:(body:{}) => Promise<number>
 * - onFetchTotalQty:  (body:{}) => Promise<number>
 * - role guards (optional): isAdmin, isSubAdmin, isAccountant, isPetCreator, isPetProcessor
 */
export default function OrderPet({
  onFetchList,
  onFetchTotalPrice,
  onFetchTotalQty,
  isAdmin = () => true,
  isSubAdmin = () => true,
  isAccountant = () => true,
  isPetCreator = () => false,
  isPetProcessor = () => false,
}) {
  const [form] = Form.useForm();

  // params như Angular (PET)
  const [params, setParams] = useState({
    code: undefined,
    orderCode: undefined,
    customerName: undefined,
    customerCode: undefined,

    status: null,
    paymentStatus: null,
    listBeingProduced: null,
    machine: null,

    fromOrderTime: null,
    toOrderTime: null,
    fromCreatedTime: null,
    toCreatedTime: null,

    billetPrinterName: undefined,
  });

  // table state
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // totals
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  // build body theo đúng Angular.addMoreBodyParams (PET)
  const buildBody = useMemo(() => {
    const body = {
      pageSize,
      pageNumber,
      isDelete: 'NO',
    };

    // text fields
    ['code', 'orderCode', 'customerName', 'customerCode', 'billetPrinterName'].forEach((k) => {
      const v = params[k];
      if (v != null && v !== '') body[k] = String(v).trim();
    });

    // time ranges
    ['fromOrderTime', 'toOrderTime', 'fromCreatedTime', 'toCreatedTime'].forEach((k) => {
      if (params[k] != null) body[k] = params[k];
    });

    // payment status
    if (params.paymentStatus != null && params.paymentStatus !== 'null') {
      body.paymentStatus = params.paymentStatus;
    }

    // listBeingProduced => lstStatus preset
    if (params.listBeingProduced != null && params.listBeingProduced !== 'null') {
      body.listBeingProduced = ['APPROVAL', 'PRINTING', 'PRINTED', 'EXTRACTING', 'EXTRACTED', 'CUTTED'];
      body.lstStatus = ['APPROVAL', 'PRINTING', 'PRINTED', 'EXTRACTING', 'EXTRACTED', 'CUTTED'];
    } else {
      body.listBeingProduced = [];
      body.lstStatus = [];
    }

    // single status has priority
    if (params.status !== null && params.status !== 'null') {
      body.lstStatus = [params.status];
    } else {
      if (params.listBeingProduced != null && params.listBeingProduced !== 'null') {
        body.lstStatus = ['APPROVAL', 'PRINTING', 'PRINTED', 'EXTRACTING', 'EXTRACTED', 'CUTTED'];
      } else {
        body.lstStatus = [];
      }
    }

    // machine
    if (params.machine != null && params.machine !== 'null') {
      body.machine = params.machine;
    }

    return body;
  }, [params, pageNumber, pageSize]);

  const loadData = async (page = pageNumber, size = pageSize) => {
    setLoading(true);
    try {
      // cập nhật page state trước khi build lại body kế tiếp
      setPageNumber(page);
      setPageSize(size);

      // dùng body đã memo
      const body = { ...buildBody, pageNumber: page, pageSize: size };

      if (onFetchList) {
        const res = await onFetchList(body);
        setRows(res?.list || []);
        setCount(res?.count || 0);
      }

      if (onFetchTotalPrice) {
        const price = await onFetchTotalPrice(body);
        setTotalPrice(price ?? 0);
      }
      if (onFetchTotalQty) {
        const qty = await onFetchTotalQty(body);
        setTotalQuantity(qty ?? 0);
      }
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
  }, [buildBody]);

  // columns theo Angular PET
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
      { title: 'Máy in', dataIndex: ['printer', 'name'] },
    ];

    if (isAdmin() || isSubAdmin() || isAccountant()) {
      cols.push({
        title: 'Đơn giá',
        dataIndex: 'price',
        align: 'right',
        render: (v) => (v != null ? Number(v).toLocaleString('vi-VN') : ''),
      });
    }
    if (isAdmin() || isSubAdmin()) {
      cols.push({
        title: 'Số lượng',
        dataIndex: 'quantity',
        align: 'right',
      });
    }

    cols.push(
      {
        title: 'Ngày đặt hàng',
        dataIndex: 'orderedTime',
        align: 'right',
        render: (v) => (v ? moment(v).format('DD/MM/YYYY') : ''),
      },
      { title: 'Thời gian ra mẫu', dataIndex: 'timeProcessing', align: 'center' },
      {
        title: 'Trạng thái sx',
        dataIndex: 'status',
        align: 'right',
        render: (s) => (s ? <Tag color={STATUS_TAG[s]}>{STATUS_LABEL[s]}</Tag> : null),
      },
      {
        title: 'Trạng thái thanh toán',
        dataIndex: 'paymentStatus',
        align: 'right',
        render: (p) => (p ? <Tag color={PAYMENT_TAG[p]}>{PAYMENT_LABEL[p]}</Tag> : null),
      },
    );

    return cols;
  }, [pageNumber, pageSize]);

  // set param helpers
  const setInput = (k) => (e) =>
    setParams((p) => ({ ...p, [k]: e?.target?.value?.trim?.() ?? e?.target?.value ?? undefined }));
  const setSelect = (k) => (v) => setParams((p) => ({ ...p, [k]: v ?? null }));
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
    <Card title="Danh sách lệnh in PET" bordered={false} className="order-pet">
      {/* FILTER GỌN (giống form bạn yêu cầu) */}
      <Form
        layout="vertical"
        onFinish={() => loadData(1, pageSize)}
        className="filter-compact"
      >
        <Row gutter={[8, 8]} align="bottom">
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Mã lệnh">
              <Input allowClear placeholder="Nhập mã lệnh" onChange={setInput('code')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Mã đơn hàng">
              <Input allowClear placeholder="Nhập mã đơn hàng" onChange={setInput('orderCode')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Trạng thái lệnh">
              <Select allowClear placeholder="Chọn trạng thái" onChange={setSelect('status')}>
                {statusOptions.map((s) => (
                  <Option key={String(s.value)} value={s.value}>{s.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Trạng thái thanh toán">
              <Select allowClear placeholder="Chọn trạng thái" onChange={setSelect('paymentStatus')}>
                {paymentOptions.map((s) => (
                  <Option key={String(s.value)} value={s.value}>{s.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Khách hàng">
              <Input allowClear onChange={setInput('customerName')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Mã khách hàng">
              <Input allowClear onChange={setInput('customerCode')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Thời gian khách đặt">
              <RangePicker onChange={setRange('fromOrderTime', 'toOrderTime')} format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Thời gian tạo lệnh">
              <RangePicker onChange={setRange('fromCreatedTime', 'toCreatedTime')} format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Máy in">
              <Select allowClear placeholder="Chọn máy in" onChange={setSelect('machine')}>
                {lstMachine.map((m) => (
                  <Option key={String(m.value)} value={m.value}>{m.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Tổng hợp lệnh đang sản xuất">
              <Select allowClear placeholder="Chọn" onChange={setSelect('listBeingProduced')}>
                {beingProducedOptions.map((s) => (
                  <Option key={String(s.value)} value={s.value}>{s.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Máy in (tên khổ/nhân công)">
              <Input allowClear placeholder="Tên máy/nhân công ép" onChange={setInput('billetPrinterName')} />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <div className="actions-bar">
              <Button type="primary" htmlType="submit">Tìm kiếm</Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  form.resetFields();
                  setParams({
                    code: undefined,
                    orderCode: undefined,
                    customerName: undefined,
                    customerCode: undefined,
                    status: null,
                    paymentStatus: null,
                    listBeingProduced: null,
                    machine: null,
                    fromOrderTime: null,
                    toOrderTime: null,
                    fromCreatedTime: null,
                    toCreatedTime: null,
                    billetPrinterName: undefined,
                  });
                  loadData(1, pageSize);
                }}
              >
                Xóa lọc
              </Button>
            </div>
          </Col>
        </Row>
      </Form>

      {/* DASHBOARD (tổng) */}
      <div style={{ padding: '8px 5px' }}>
        <Text style={{ paddingRight: 12 }}>Tổng số lệnh: {count}</Text>
      </div>

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
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, size) => loadData(page, size),
          }}
          summary={() =>
            rows?.length > 0 &&
            !isPetProcessor() &&
            !isPetCreator() && (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={5} />
                  <Table.Summary.Cell index={5} align="right"><b>Tổng:</b></Table.Summary.Cell>
                  {(isAdmin() || isSubAdmin() || isAccountant()) && (
                    <Table.Summary.Cell index={6} align="right"><b>{Number(totalPrice).toLocaleString('vi-VN')}</b></Table.Summary.Cell>
                  )}
                  {(isAdmin() || isSubAdmin()) ? (
                    <Table.Summary.Cell index={7} align="right"><b>{totalQuantity ?? 0}</b></Table.Summary.Cell>
                  ) : null}
                  <Table.Summary.Cell index={8} colSpan={4} />
                </Table.Summary.Row>
              </Table.Summary>
            )
          }
        />
      </Card>
    </Card>
  );
}
