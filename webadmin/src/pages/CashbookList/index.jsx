import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Table, Tag, Typography, message } from 'antd';
import moment from 'moment';
import { getCashbookList } from '../DebtManagement/service/be.api';
import { getCashbookTotals } from '../DebtManagement/service/be.api';
import './index.less';

const { RangePicker } = DatePicker;
const { Text } = Typography;

/** --- select options --- */
const typeOptions = [
  { value: null, label: '[--Tất cả--]' },
  { value: '0', label: 'Phiếu thu' },
  { value: '1', label: 'Phiếu chi' },
  { value: '2', label: 'Phiếu ghi nợ' },
];

const isPetOptions = [
  { value: null, label: '[--Tất cả--]' },
  { value: 'NO', label: 'Đơn in chuyển nhiệt' },
  { value: 'YES', label: 'Đơn in PET' },
];

const stateOptions = [
  { value: null, label: '[--Tất cả--]' },
  { value: '0', label: 'Chưa xử lý' },
  { value: '1', label: 'Đã xử lý' },
];

const paymentMethodOptions = [
  { value: null, label: '[--Tất cả--]' },
  { value: 'TECHCOMBANK', label: 'Techcombank' },
  { value: 'VIETCOMBANK', label: 'Vietcombank' },
  { value: 'SEABANK', label: 'Seabank' },
  { value: 'CASH', label: 'Tiền mặt' },
  { value: 'NAMABANK', label: 'Nam Á Bank' },
];

/** --- helpers --- */
const paymentMethodText = (m) => {
  switch (m) {
    case 'TECHCOMBANK': return 'Techcombank';
    case 'VIETCOMBANK': return 'Vietcombank';
    case 'SEABANK': return 'Seabank';
    case 'CASH': return 'Tiền mặt';
    case 'NAMABANK': return 'Nam Á Bank';
    default: return '';
  }
};
const stateTag = (s) => (Number(s) === 1 ? 'success' : 'default');
const money = (v) => (v == null ? '' : Number(v).toLocaleString());

export default function CashbookList() {
  const [form] = Form.useForm();

  const [params, setParams] = useState({
    code: undefined,
    customerName: undefined,
    type: null,
    isPet: null, // YES/NO
    state: null, // 0/1
    paymentMethod: null,
    fromDate: null,
    toDate: null,
  });

  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [totals, setTotals] = useState({ revenue: 0, expenditure: 0 });

  // quyền – nếu có phân quyền thật thì thay thế các hàm mock này
  const isPetAccountant = () => false;

  // build body giống Angular addMoreBodyParams
  const buildBody = (extra = {}) => {
    const body = { ...extra };

    if (params.code) body.code = String(params.code).trim();
    if (params.customerName) body.customerName = String(params.customerName).trim();

    if (params.type != null && params.type !== 'null') body.type = params.type;
    if (params.state != null && params.state !== 'null') body.state = params.state;
    if (params.paymentMethod != null && params.paymentMethod !== 'null') body.paymentMethod = params.paymentMethod;

    if (params.fromDate != null) body.fromDate = params.fromDate;
    if (params.toDate != null) body.toDate = params.toDate;

    // isPet / isThernal theo đặc tả Angular
    if (params.isPet != null && params.isPet !== 'null') {
      if (params.isPet === 'YES') body.isPet = 'YES';
      if (params.isPet === 'NO') body.isThernal = 'YES';
    }

    if (isPetAccountant()) {
      body.isPet = 'YES';
    }

    return body;
  };

  const loadData = async (page = pageNumber, size = pageSize) => {
    setLoading(true);
    try {
      const base = { pageNumber: page, pageSize: size };
      const body = buildBody(base);

      const listResp = await getCashbookList(body);
      setRows(listResp?.list || []);
      setCount(listResp?.count || 0);
      setPageNumber(page);
      setPageSize(size);

      // totals
      const totalResp = await getCashbookTotals(buildBody({}));
      setTotals({
        revenue: Number(totalResp?.revenue) || 0,
        expenditure: Number(totalResp?.expenditure) || 0,
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

  // columns
  const columns = useMemo(
    () => [
      {
        title: 'STT',
        width: 64,
        align: 'center',
        render: (_v, _r, i) => (pageNumber - 1) * pageSize + i + 1,
        responsive: ['lg'],
      },
      { title: 'Mã phiếu', dataIndex: 'code' },
      {
        title: 'Loại phiếu',
        dataIndex: 'type',
        render: (t) => (String(t) === '0' ? 'Phiếu thu' : String(t) === '1' ? 'Phiếu chi' : 'Phiếu ghi nợ'),
      },
      {
        title: 'Loại đơn hàng',
        dataIndex: 'isPet',
        render: (v) => (v === 'NO' ? 'Đơn in chuyển nhiệt' : 'Đơn in PET'),
      },
      { title: 'Nội dung', dataIndex: 'note' },
      {
        title: 'Số tiền thu',
        render: (_, r) => (String(r.type) === '0' ? money(r.value) : ''),
        align: 'right',
      },
      {
        title: 'Số tiền chi',
        render: (_, r) => (String(r.type) !== '0' ? money(r.value) : ''),
        align: 'right',
      },
      { title: 'Nguồn thu/chi', dataIndex: 'paymentMethod', render: paymentMethodText },
      { title: 'Khách hàng', dataIndex: ['customer', 'name'] },
      { title: 'Người tạo', dataIndex: ['createdBy', 'name'] },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        render: (v) => (v ? moment(v).format('DD/MM/YYYY') : ''),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'state',
        align: 'center',
        render: (s) => <Tag color={stateTag(s)}>{Number(s) === 1 ? 'Đã xử lý' : 'Chưa xử lý'}</Tag>,
      },
    ],
    [pageNumber, pageSize]
  );

  // set param helpers
  const setInput = (k) => (e) =>
    setParams((p) => ({ ...p, [k]: e?.target?.value?.trim?.() ?? e?.target?.value ?? undefined }));
  const setSelect = (k) => (v) => setParams((p) => ({ ...p, [k]: v }));
  const setRange = (val) => {
    if (val && val.length === 2) {
      setParams((p) => ({
        ...p,
        fromDate: moment(val[0]).startOf('day').valueOf(),
        toDate: moment(val[1]).endOf('day').valueOf(),
      }));
    } else {
      setParams((p) => ({ ...p, fromDate: null, toDate: null }));
    }
  };

  // export Excel đơn giản (CSV)
  const exportExcel = async () => {
    try {
      const body = buildBody({ isExportExcel: true });
      const resp = await getCashbookList(body);
      const list = resp?.list || [];
      const rowsCsv = [
        [
          'STT',
          'Mã phiếu',
          'Loại phiếu',
          'Loại đơn hàng',
          'Nội dung',
          'Số tiền thu',
          'Số tiền chi',
          'Nguồn thu/chi',
          'Khách hàng',
          'Người tạo',
          'Ngày tạo',
          'Trạng thái',
        ].join(','),
        ...list.map((it, idx) =>
          [
            idx + 1,
            `"${it.code ?? ''}"`,
            String(it.type) === '0' ? 'Phiếu thu' : String(it.type) === '1' ? 'Phiếu chi' : 'Phiếu ghi nợ',
            it.isPet === 'NO' ? 'Đơn in chuyển nhiệt' : 'Đơn in PET',
            `"${(it.note ?? '').replace(/"/g, '""')}"`,
            String(it.type) === '0' ? it.value ?? '' : '',
            String(it.type) !== '0' ? it.value ?? '' : '',
            paymentMethodText(it.paymentMethod),
            `"${it?.customer?.name ?? ''}"`,
            `"${it?.createdBy?.name ?? ''}"`,
            it.createdAt ? moment(it.createdAt).format('DD/MM/YYYY') : '',
            Number(it.state) === 1 ? 'Đã xử lý' : 'Chưa xử lý',
          ].join(',')
        ),
      ].join('\n');

      const blob = new Blob([rowsCsv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'danh-sach-thu-chi.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      message.error('Xuất Excel thất bại');
    }
  };

  return (
    <Card title="Danh sách thu chi" bordered={false}>
      {/* FILTER */}
      <Form form={form} layout="vertical" onFinish={() => loadData(1, pageSize)}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Mã phiếu">
              <Input allowClear onChange={setInput('code')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Tên khách hàng">
              <Input allowClear onChange={setInput('customerName')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Loại phiếu">
              <Select options={typeOptions} onChange={setSelect('type')} allowClear />
            </Form.Item>
          </Col>

          {!isPetAccountant() && (
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label="Loại đơn hàng">
                <Select options={isPetOptions} onChange={setSelect('isPet')} allowClear />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Trạng thái">
              <Select options={stateOptions} onChange={setSelect('state')} allowClear />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Từ ngày - Đến ngày">
              <RangePicker onChange={setRange} format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Phương thức thanh toán">
              <Select options={paymentMethodOptions} onChange={setSelect('paymentMethod')} allowClear />
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
                  customerName: undefined,
                  type: null,
                  isPet: null,
                  state: null,
                  paymentMethod: null,
                  fromDate: null,
                  toDate: null,
                });
                loadData(1, pageSize);
              }}
            >
              Xóa lọc
            </Button>
          </Col>
        </Row>
      </Form>

      {/* TABLE + ACTIONS */}
      <Card bodyStyle={{ padding: 0 }} style={{ marginTop: 12 }}>
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
          footer={() => (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button onClick={exportExcel}>Xuất excel</Button>
              <Text>
                Tổng thu: <b>{money(totals.revenue)}</b>&nbsp;&nbsp;&nbsp;
                Tổng chi: <b>{money(totals.expenditure)}</b>&nbsp;&nbsp;&nbsp;
                Số dư: <b>{money(Number(totals.revenue) - Number(totals.expenditure))}</b>
              </Text>
            </div>
          )}
        />
      </Card>
    </Card>
  );
}
