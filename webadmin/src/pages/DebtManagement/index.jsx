import { useEffect, useMemo, useState } from 'react';
import { Button, Col, DatePicker, Input, Row, Select, Table } from 'antd';
import moment from 'moment';
import './index.less';
import { getListPaymentHistory } from './service/ar.api'; // API v2 list

export default function DebtManagement() {
  // ---- filters / params ----
  const [params, setParams] = useState({
    code: '',
    name: '',
    salerName: '',
    phone: '',
    printType: 0,           // 0=all, 1=thermal, 2=PET, 3=direct
    haveDebt: '',           // '' | 'NO' | 'YES'
    fromCompletedTime: null,
    toCompletedTime: null,
  });

  // ---- table state ----
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 10, count: 0 });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState({ data: false, excel: false });

  // ---- constants ----
  const listType = [
    { value: 0, label: '[--Tất cả--]' },
    { value: 1, label: 'Đơn hàng in chuyển nhiệt' },
    { value: 2, label: 'Đơn hàng in PET' },
    { value: 3, label: 'Đơn hàng in trực tiếp' },
  ];
  const lstDebt = [
    { value: '', label: '[--Tất cả--]' },
    { value: 'NO', label: 'Khách hàng đã thanh toán' },
    { value: 'YES', label: 'Khách hàng thanh toán dở' },
  ];

  // ---- utils ----
  const fmtMoney = (n) => Number(n || 0).toLocaleString();
  const fmtQty = (n) =>
    Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 3 });

  const buildBody = (extra = {}) => {
    const body = {
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      isRevenue: 1,
      ...extra,
    };
    if (params.name) body.name = params.name.trim();
    if (params.phone) body.phone = params.phone.trim();
    if (params.salerName) body.salerName = params.salerName.trim();
    if (params.code) body.code = params.code.trim();

    if (params.printType != null && params.printType !== 0) body.printType = params.printType;
    if (params.haveDebt != null && params.haveDebt !== '') body.haveDebt = params.haveDebt;

    if (params.fromCompletedTime) body.fromTime = params.fromCompletedTime;
    if (params.toCompletedTime) body.toTime = params.toCompletedTime;

    return body;
  };

  const reloadData = async (resetPage = false) => {
    if (resetPage) setPagination((p) => ({ ...p, pageNumber: 1 }));

    setLoading((s) => ({ ...s, data: true }));
    try {
      const res = await getListPaymentHistory(buildBody({}));
      setRecords(res?.list || []);
      setPagination((p) => ({ ...p, count: res?.count || 0 }));
    } finally {
      setLoading((s) => ({ ...s, data: false }));
    }
  };

  // ---- init: KHÔNG set ngày mặc định (mặc định = Tất cả) ----
  useEffect(() => {
    setParams((p) => ({ ...p, fromCompletedTime: null, toCompletedTime: null }));
  }, []);

  // ---- load list when filters / pagination change ----
  useEffect(() => {
    reloadData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.pageNumber,
    pagination.pageSize,
    params.code,
    params.name,
    params.salerName,
    params.phone,
    params.printType,
    params.haveDebt,
    params.fromCompletedTime,
    params.toCompletedTime,
  ]);

  // ---- filters handlers ----
  const onSearchCode = (v) => setParams((p) => ({ ...p, code: v || '' }));
  const onSearchName = (v) => setParams((p) => ({ ...p, name: v || '' }));
  const onSearchSalerName = (v) => setParams((p) => ({ ...p, salerName: v || '' }));
  const onSearchPhone = (v) => setParams((p) => ({ ...p, phone: v || '' }));
  const onSearchTime = (range) => {
    if (range && range.length === 2) {
      const from = moment(range[0]).startOf('day').valueOf();
      const to = moment(range[1]).endOf('day').valueOf();
      setParams((p) => ({ ...p, fromCompletedTime: from, toCompletedTime: to }));
    } else {
      setParams((p) => ({ ...p, fromCompletedTime: null, toCompletedTime: null }));
    }
  };

  // ---- export CSV theo list đã lọc (tối đa 100000 hàng) ----
  const exportExcel = async () => {
    setLoading((s) => ({ ...s, excel: true }));
    try {
      const res = await getListPaymentHistory(
        buildBody({ isExportExcel: true, pageNumber: 1, pageSize: 100000 }),
      );
      const list = res?.list || [];
      const header = [
        'STT',
        'Mã khách hàng',
        'Tên khách hàng',
        'Nhân viên kinh doanh',
        'Nợ cũ',
        'Doanh thu',
        'Sản lượng',
        'Phát sinh khác',
        'Giảm trừ doanh thu',
        'Thanh toán trong kỳ',
        'Nợ còn lại',
      ];
      const rows = list.map((it, idx) => [
        idx + 1,
        it.code || '',
        it.name || '',
        it.saler?.name || '',
        it.oldDept || 0,
        it.revenueInPeriod || 0,
        it.quantityInPeriod || 0,
        it.otherArisingInPeriod || 0,
        it.reduceInPeriod || 0,
        it.paidInPeriod || 0,
        it.deptInPeriod || 0,
      ]);
      const totalDept = list.reduce((s, x) => s + (x.deptInPeriod || 0), 0);
      rows.push(['', '', '', '', '', '', '', '', '', 'Tổng nợ còn lại', totalDept]);

      const csv = [header, ...rows]
        .map((r) =>
          r
            .map((v) => {
              const s = (v ?? '').toString().replace(/"/g, '"');
              return /[",\n]/.test(s) ? `"${s}"` : s;
            })
            .join(','),
        )
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'danh_sach_cong_no_khach_hang.csv';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading((s) => ({ ...s, excel: false }));
    }
  };

  // ---- totals theo TRANG hiện tại (client-side) ----
  const pageTotals = useMemo(() => {
    const t = {
      sumRevenue: 0,
      sumQuantity: 0,
      sumOtherArising: 0,
      sumReduce: 0,
      sumPayment: 0,
    };
    for (const r of records) {
      t.sumRevenue += Number(r?.revenueInPeriod || 0);
      t.sumQuantity += Number(r?.quantityInPeriod || 0);
      t.sumOtherArising += Number(r?.otherArisingInPeriod || 0);
      t.sumReduce += Number(r?.reduceInPeriod || 0);
      t.sumPayment += Number(r?.paidInPeriod || 0);
    }
    return t;
  }, [records]);

  // ---- columns (đủ cột như Angular) ----
  const columns = useMemo(
    () => [
      {
        title: 'STT',
        dataIndex: '_idx',
        width: 70,
        align: 'center',
        render: (_, __, i) =>
          (pagination.pageNumber - 1) * pagination.pageSize + i + 1,
      },
      { title: 'Mã khách hàng', dataIndex: 'code', width: 140, align: 'center' },
      { title: 'Tên khách hàng', dataIndex: 'name', align: 'center' }, // <— BỔ SUNG RÕ RÀNG
      {
        title: 'Nhân viên kinh doanh',
        dataIndex: ['saler', 'name'],
        align: 'center',
        render: (_, r) => r?.saler?.name || '',
      },
      { title: 'Nợ cũ', dataIndex: 'oldDept', align: 'right', render: fmtMoney },

      // Nhóm “Phát sinh trong kỳ”
      {
        title: (
          <div style={{ textAlign: 'center' }}>
            Phát sinh trong kỳ
          </div>
        ),
        children: [
          {
            title: 'Doanh thu',
            dataIndex: 'revenueInPeriod',
            align: 'right',
            render: fmtMoney,
          },
          {
            title: 'Sản lượng',
            dataIndex: 'quantityInPeriod',
            align: 'right',
            render: fmtQty,
          },
          {
            title: 'Phát sinh khác',
            dataIndex: 'otherArisingInPeriod',
            align: 'right',
            render: fmtMoney,
          },
        ],
      },

      { title: 'Giảm trừ DT', dataIndex: 'reduceInPeriod', align: 'right', render: fmtMoney },
      { title: 'Thanh toán trong kỳ', dataIndex: 'paidInPeriod', align: 'right', render: fmtMoney },
      { title: 'Nợ còn lại', dataIndex: 'deptInPeriod', align: 'right', render: fmtMoney },
    ],
    [pagination.pageNumber, pagination.pageSize],
  );

  return (
    <div className="ar-page">
      <div className="ar-title">Danh sách công nợ khách hàng</div>

      {/* FILTER BAR */}
      <div className="ar-filter">
        <Row gutter={[12, 12]}>
          <Col xs={24} md={6}>
            <label>Mã khách hàng</label>
            <Input.Search allowClear placeholder="Tìm kiếm" onSearch={onSearchCode} />
          </Col>
          <Col xs={24} md={6}>
            <label>Tên khách hàng</label>
            <Input.Search allowClear placeholder="Tìm kiếm" onSearch={onSearchName} />
          </Col>
          <Col xs={24} md={6}>
            <label>Tên nhân viên kinh doanh</label>
            <Input.Search allowClear placeholder="Tìm kiếm" onSearch={onSearchSalerName} />
          </Col>
          <Col xs={24} md={6}>
            <label>Số điện thoại</label>
            <Input.Search allowClear placeholder="Tìm kiếm" onSearch={onSearchPhone} />
          </Col>

          <Col xs={24} md={6}>
            <label>Loại đơn hàng</label>
            <Select
              options={listType}
              value={params.printType}
              onChange={(v) => setParams((p) => ({ ...p, printType: v }))}
              style={{ width: '100%' }}
            />
          </Col>

          <Col xs={24} md={6}>
            <label>Trạng thái khách hàng</label>
            <Select
              options={lstDebt}
              value={params.haveDebt}
              onChange={(v) => setParams((p) => ({ ...p, haveDebt: v }))}
              style={{ width: '100%' }}
            />
          </Col>

          <Col xs={24} md={6}>
            <label>Thời gian</label>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              value={
                params.fromCompletedTime && params.toCompletedTime
                  ? [moment(params.fromCompletedTime), moment(params.toCompletedTime)]
                  : null
              }
              allowClear
              onChange={onSearchTime}
            />
          </Col>

          <Col xs={24} className="ar-actions">
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                onClick={() => {
                  setParams({
                    code: '',
                    name: '',
                    salerName: '',
                    phone: '',
                    printType: 0,
                    haveDebt: '',
                    fromCompletedTime: null,
                    toCompletedTime: null,
                  });
                  setPagination((p) => ({ ...p, pageNumber: 1 }));
                }}
              >
                Làm mới
              </Button>
              <Button type="primary" onClick={() => reloadData(true)}>
                Bộ lọc
              </Button>
              <div style={{ flex: 1 }} />
              <Button loading={loading.excel} onClick={exportExcel}>
                Xuất excel
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* TABLE */}
      <Table
        className="ar-table"
        rowKey={(r) => r.id}
        dataSource={records}
        columns={columns}
        loading={loading.data}
        pagination={{
          current: pagination.pageNumber,
          pageSize: pagination.pageSize,
          total: pagination.count,
          showSizeChanger: true,
          onChange: (page, pageSize) => setPagination({ ...pagination, pageNumber: page, pageSize }),
          showTotal: (t, r) => `${r[0]} - ${r[1]} của ${t}`,
        }}
        bordered
        summary={() => (
          <Table.Summary.Row>
            {/* trống mấy cột đầu để canh đúng layout như Angular */}
            <Table.Summary.Cell index={0} />
            <Table.Summary.Cell index={1} />
            <Table.Summary.Cell index={2} />
            <Table.Summary.Cell index={3} />
            <Table.Summary.Cell index={4} />
            <Table.Summary.Cell index={5}>
              <b>{fmtMoney(pageTotals.sumRevenue)}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={6}>
              <b>{fmtQty(pageTotals.sumQuantity)}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={7}>
              <b>{fmtMoney(pageTotals.sumOtherArising)}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={8}>
              <b>{fmtMoney(pageTotals.sumReduce)}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={9}>
              <b>{fmtMoney(pageTotals.sumPayment)}</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={10}>
              <b>
                {fmtMoney(
                  pageTotals.sumRevenue +
                    pageTotals.sumOtherArising -
                    pageTotals.sumReduce -
                    pageTotals.sumPayment,
                )}
              </b>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </div>
  );
}
