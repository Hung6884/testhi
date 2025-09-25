import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Table, Tag, Typography, message } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './index.less';
import { getListProductionOrders } from '../../DebtManagement/service/be.api';
import { getThermalSummary } from '../../DebtManagement/service/ar.api';
const { RangePicker } = DatePicker;
const { Text } = Typography;

/** ---- labels ---- */
const STATUS_LABEL = {
    CREATED: 'Chưa duyệt',
    APPROVAL: 'Chưa in',
    PRINTING: 'Đang in dở',
    PRINTED: 'Chưa ép',
    EXTRACTING: 'Đang ép dở',
    EXTRACTED: 'Đã ép xong',
    DELIVERING: 'Đang giao hàng',
    COMPLETE: 'Đã giao hàng',
};
const STATUS_TAG = {
    CREATED: 'default',
    APPROVAL: 'cyan',
    PRINTING: 'processing',
    PRINTED: 'geekblue',
    EXTRACTING: 'orange',
    EXTRACTED: 'blue',
    DELIVERING: 'purple',
    COMPLETE: 'green',
};
const PAYMENT_LABEL = { UNPAID: 'Chưa thanh toán', PARTPAY: 'Thanh toán dở', PAID: 'Đã thanh toán' };
const PAYMENT_TAG = { UNPAID: 'error', PARTPAY: 'warning', PAID: 'success' };

/** ---- options ---- */
const statusOptions = [
    { value: null, label: '[--Tất cả--]' },
    { value: 'CREATED', label: 'Chưa duyệt' },
    { value: 'APPROVAL', label: 'Chưa in' },
    { value: 'PRINTING', label: 'Đang in dở' },
    { value: 'PRINTED', label: 'Chưa ép' },
    { value: 'EXTRACTING', label: 'Đang ép dở' },
    { value: 'EXTRACTED', label: 'Đã ép xong' },
    { value: 'DELIVERING', label: 'Đang giao hàng' },
    { value: 'COMPLETE', label: 'Đã giao hàng' },
];
const paymentOptions = [
    { value: null, label: '[--Tất cả--]' },
    { value: 'UNPAID', label: 'Chưa thanh toán' },
    { value: 'PARTPAY', label: 'Thanh toán dở' },
    { value: 'PAID', label: 'Đã thanh toán' },
];
const patternOptions = [
    { value: null, label: '[--Tất cả--]' },
    { value: 'YES', label: 'Dùng mẫu tổ vẽ' },
    { value: 'NO', label: 'Dùng mẫu ngoài' },
];
const beingProducedOptions = [
    { value: null, label: '[--Tất cả--]' },
    { value: 'ALL', label: 'Hiển thị các lệnh đang sản xuất' },
];

/** ---- api helper (thay URL khi nối BE) ---- */
async function postJSON(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // thêm Authorization nếu dùng JWT
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
}

export default function OrderThermal() {
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
        billetPrinterName: undefined,

        status: null,
        paymentStatus: null,
        isPattern: null,
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
        totalPrintedMd: 0,
        lstSumQuantity: [],
    });

    // quyền – tạm thời mock để hiển thị đủ cột
    const isAdmin = () => true;
    const isSubAdmin = () => true;
    const isAccountant = () => true;

    // build body như Angular addMoreBodyParams
    const buildBody = (extra = {}) => {
        const body = { ...extra };

        [
            'code', 'orderCode', 'customerName', 'customerCode',
            'painterName', 'salerName', 'colorTesterName', 'billetPrinterName',
        ].forEach((k) => {
            if (params[k] != null && params[k] !== '') body[k] = String(params[k]).trim();
        });

        ['fromOrderTime', 'toOrderTime', 'fromCreatedTime', 'toCreatedTime'].forEach((k) => {
            if (params[k] != null) body[k] = params[k];
        });

        if (params.paymentStatus != null && params.paymentStatus !== 'null') body.paymentStatus = params.paymentStatus;
        if (params.isPattern != null && params.isPattern !== 'null') body.isPattern = params.isPattern;

        if (params.listBeingProduced != null && params.listBeingProduced !== 'null') {
            body.listBeingProduced = ['APPROVAL', 'PRINTING', 'PRINTED', 'EXTRACTING', 'EXTRACTED'];
            body.lstStatus = ['APPROVAL', 'PRINTING', 'PRINTED', 'EXTRACTING', 'EXTRACTED'];
        } else {
            body.listBeingProduced = [];
            body.lstStatus = [];
        }

        if (params.status !== null && params.status !== 'null') {
            body.lstStatus = [params.status];
            const idToSend = {
                CREATED: 0, APPROVAL: 1, PRINTING: 2, PRINTED: 3,
                EXTRACTING: 4, EXTRACTED: 5, DELIVERING: 6, COMPLETE: 7,
            };
            body.cStatus = idToSend[params.status] ?? null;
        } else {
            body.cStatus = null;
            if (params.listBeingProduced != null && params.listBeingProduced !== 'null') {
                body.lstStatus = ['APPROVAL', 'PRINTING', 'PRINTED', 'EXTRACTING', 'EXTRACTED'];
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

            const listResp = await getListProductionOrders(body); // TODO: đổi endpoint BE
            setRows(listResp?.list || []);
            setCount(listResp?.count || 0);
            setPageNumber(page);
            setPageSize(size);

            const sumResp = await getThermalSummary(body);
            setSummary({
                totalPrice: sumResp?.totalPrice || 0,
                totalQuantity: sumResp?.totalQuantity || 0,
                totalPrintedMd: sumResp?.totalPrintedMd || 0,
                lstSumQuantity: sumResp?.lstSumQuantity || [],
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
            { title: 'Máy in', dataIndex: ['billetPrinter', 'name'] },
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
            { title: 'Số lượng lỗi', dataIndex: 'defectiveQuantity', align: 'right' },
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

        // cols.push({
        //   title: '',
        //   key: 'action',
        //   width: 48,
        //   align: 'center',
        //   render: (_v, record) => (
        //     <Button type="link" onClick={(e) => { e.stopPropagation(); navigate(`/orderManagement/orderThermal/${record.id}`); }}>
        //       →
        //     </Button>
        //   ),
        // });
        return cols;
    }, [pageNumber, pageSize]);

    // set params helpers
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
        <Card title="Đơn hàng In chuyển nhiệt (OrderThermal)" bordered={false}>
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
                    <Col xs={24} sm={12} lg={6}><Form.Item label="Máy in"><Input allowClear onChange={setInput('billetPrinterName')} /></Form.Item></Col>

                    <Col xs={24} sm={12} lg={6}><Form.Item label="Trạng thái lệnh"><Select options={statusOptions} onChange={setSelect('status')} allowClear /></Form.Item></Col>
                    {(isAdmin() || isAccountant()) && (
                        <Col xs={24} sm={12} lg={6}><Form.Item label="Trạng thái thanh toán"><Select options={paymentOptions} onChange={setSelect('paymentStatus')} allowClear /></Form.Item></Col>
                    )}
                    <Col xs={24} sm={12} lg={6}><Form.Item label="Loại mẫu vẽ"><Select options={patternOptions} onChange={setSelect('isPattern')} allowClear /></Form.Item></Col>
                    <Col xs={24} sm={12} lg={6}><Form.Item label="Tổng hợp lệnh đang sản xuất"><Select options={beingProducedOptions} onChange={setSelect('listBeingProduced')} allowClear /></Form.Item></Col>

                    <Col xs={24} sm={12} lg={6}><Form.Item label="Thời gian khách đặt"><RangePicker onChange={setRange('fromOrderTime', 'toOrderTime')} format="DD/MM/YYYY" style={{ width: '100%' }} /></Form.Item></Col>
                    <Col xs={24} sm={12} lg={6}><Form.Item label="Thời gian tạo lệnh"><RangePicker onChange={setRange('fromCreatedTime', 'toCreatedTime')} format="DD/MM/YYYY" style={{ width: '100%' }} /></Form.Item></Col>

                    <Col xs={24}>
                        <Button type="primary" htmlType="submit">Tìm kiếm</Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => {
                            form.resetFields(); setParams({
                                code: undefined, orderCode: undefined, customerName: undefined, customerCode: undefined,
                                painterName: undefined, salerName: undefined, colorTesterName: undefined, billetPrinterName: undefined,
                                status: null, paymentStatus: null, isPattern: null, listBeingProduced: null,
                                fromOrderTime: null, toOrderTime: null, fromCreatedTime: null, toCreatedTime: null,
                            }); loadData(1, pageSize);
                        }}>Xóa lọc</Button>
                    </Col>
                </Row>
            </Form>

            {/* DASHBOARD */}
            <div style={{ padding: '8px 5px' }}>
                <Text style={{ paddingRight: 12 }}>Tổng số lệnh: {count}</Text>
                <Text style={{ paddingRight: 12 }}>Khối lượng: </Text>
                {summary.lstSumQuantity.map((it) => (
                    <Text key={it.name} style={{ paddingRight: 8 }}>
                        {it.sumQuantity} {it.name},
                    </Text>
                ))}
            </div>
            <div style={{ padding: '0 5px 8px' }}>
                <Text>Khối lượng md đã in phôi: {summary.totalPrintedMd} md</Text>
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
                        pageSize: pageSize,
                        total: count,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        onChange: (page, size) => loadData(page, size),
                    }}
                //   onRow={(record) => ({
                //     onClick: () => navigate(`/orderManagement/orderThermal/${record.id}`),
                //   })}
                />
            </Card>
        </Card>
    );
}
