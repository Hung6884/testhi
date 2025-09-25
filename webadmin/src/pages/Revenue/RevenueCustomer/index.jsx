import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getCustomers } from "../../DebtManagement/service/be.api";
import { getTotalRevenueCustomer } from "../../DebtManagement/service/ar.api";
import "./index.less";

const SOURCE_LIST = [
  { id: "0", name: "Công ty" },
  { id: "1", name: "Tự tìm kiếm online" },
  { id: "2", name: "Khách từ Marketing" },
  { id: "3", name: "Khách offline" },
];
const LIST_TYPE = [
  { id: null, name: "[--Tất cả--]" },
  { id: "NO", name: "Khách in chuyển nhiệt" },
  { id: "YES", name: "Khách hàng in PET" },
];
const LST_DEBT = [
  { id: null, name: "[--Tất cả--]" },
  { id: "NO", name: "Khách hàng đã thanh toán" },
  { id: "YES", name: "Khách hàng thanh toán dở" },
];

const formatCurrency = (n) =>
  (n ?? 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
const formatDate = (d) => {
  if (d == null) return "";
  const dt = typeof d === "number" ? new Date(d) : new Date(d);
  return isNaN(+dt) ? "" : dt.toLocaleDateString("vi-VN");
};
const startOfDay = (t) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
const endOfDay = (t) => {
  const d = new Date(t);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};
const sourceName = (v) =>
  SOURCE_LIST.find((x) => String(x.id) === String(v ?? ""))?.name ?? "";

export default function RevenueCustomerPage({
  title = "Danh sách công nợ khách hàng",
  roles = [],
  pageSizeDefault = 20,
  salerIdFromRoute = null,
}) {
  const isAdmin = useMemo(() => roles.includes("admin"), [roles]);
  const isSubAdmin = useMemo(() => roles.includes("subAdmin"), [roles]);
  const isSale = useMemo(() => roles.includes("sale"), [roles]);
  const isAccountant = useMemo(() => roles.includes("accountant"), [roles]);
  const isPetAccountant = useMemo(
    () => roles.includes("petAccountant"),
    [roles]
  );
  const isSaleManager = useMemo(
    () => roles.includes("saleManager"),
    [roles]
  );
  const canSeeName =
    isAdmin || isSale || isAccountant || isPetAccountant || isSaleManager;
  const canSeeTotals =
    isAdmin || isSubAdmin || isAccountant || isPetAccountant || isSaleManager;

  const [params, setParams] = useState({
    name: null,
    phone: null,
    code: null,
    isPet: null,
    haveDebt: null,
    fromTime: null,
    toTime: null,
    salerId: salerIdFromRoute ?? "",
  });
  const [records, setRecords] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [testNodeRed, setNRRev] = useState(null);
  const [password, setPassword] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [selectedRecord, setSel] = useState(null);
  const [loading, setLoading] = useState({
    list: false,
    revenue: false,
    export: false,
  });
  const [pagination, setPaging] = useState({
    pageNumber: 1,
    count: pageSizeDefault,
    total: 0,
  });

  const buildBody = useCallback(
    (extra = {}) => {
      const body = { ...extra };

      if (params.name != null) body.name = params.name;
      if (params.phone != null) body.phone = params.phone;
      if (params.code != null) body.code = params.code;

      if (params.isPet != null && params.isPet !== "") {
        if (params.isPet === "NO") body.isThernal = "YES";
        if (params.isPet === "YES") body.isPet = "YES";
      }
      if (params.haveDebt != null && params.haveDebt !== "") {
        body.haveDebt = params.haveDebt;
      }

      body.fromTime = params.fromTime ?? null;
      body.toTime = params.toTime ?? null;
      if (params.salerId != null) body.salerId = params.salerId;

      if (isPetAccountant) body.isPet = "YES";
      body.isRevenue = 1;

      body.pageSize = pagination.count;
      body.pageNumber = pagination.pageNumber;
      return body;
    },
    [params, isPetAccountant, pagination]
  );

  const loadAll = useCallback(async () => {
    setLoading((s) => ({ ...s, list: true, revenue: true }));
    const body = buildBody({ isExportExcel: false });

    try {
      const { data } = await getCustomers(body);
      setRecords(data?.list ?? []);
      setPaging((p) => ({ ...p, total: data?.count ?? 0 }));
    } catch (e) {
      console.error("BE get-list error:", e);
    } finally {
      setLoading((s) => ({ ...s, list: false }));
    }

    try {
      const { data } = await getCustomers(body);
      setRevenue(data ?? null);
    } catch (e) {
      console.error("BE revenue error:", e);
    } finally {
      setLoading((s) => ({ ...s, revenue: false }));
    }

    try {
      const { data } = await getTotalRevenueCustomer(body);
      setNRRev(data ?? null);
    } catch (e) {
      console.error("Node-RED revenue error:", e);
    }
  }, [buildBody]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onSearch = () => {
    setPaging((p) => ({ ...p, pageNumber: 1 }));
    loadAll();
  };
  const onSearchName = (v) =>
    setParams((p) => ({ ...p, name: v ? v.trim() : null }));
  const onSearchPhone = (v) =>
    setParams((p) => ({ ...p, phone: v ? v.trim() : null }));
  const onSearchCode = (v) =>
    setParams((p) => ({ ...p, code: v ? v.trim() : null }));
  const onSearchCompletedTime = (from, to) => {
    if (from && to) {
      const f = startOfDay(new Date(from).getTime());
      const t = endOfDay(new Date(to).getTime());
      setParams((p) => ({ ...p, fromTime: f, toTime: t }));
    } else {
      setParams((p) => ({ ...p, fromTime: null, toTime: null }));
    }
  };

  const getIndex = (i) =>
    (pagination.pageNumber - 1) * pagination.count + i + 1;

  const gotoDetail = (record) => {
    if (canSeeName || isSubAdmin) {
      window.location.href = `/chi-tiet-khach-hang/${record.id}`;
    } else {
      setSel(record);
      setShowAuth(true);
    }
  };

  const handleAuthEnter = async (e) => {
    if (e.keyCode === 13) {
      setShowAuth(false);
      try {
        await authenticate({ newPassword: password });
        window.location.href = `/chi-tiet-khach-hang/${selectedRecord?.id}`;
      } catch (err) {
        alert("Mật khẩu không đúng. Vui lòng đăng nhập lại!");
      }
    }
  };

  const exportExcel = async () => {
    setLoading((s) => ({ ...s, export: true }));
    try {
      const body = buildBody({ isExportExcel: true });
      const { data } = await getCustomers(body);

      const rows = (data?.list ?? []).map((item, idx) => ({
        STT: idx + 1,
        "Mã khách hàng": item.code ?? "",
        "Tên khách hàng": item.name ?? "",
        "Nhân viên kinh doanh": item?.saler?.name ?? "",
        "Nguồn khách hàng": item?.source ? sourceName(item?.source) : "",
        "Ngày tạo": formatDate(item?.createdAt) || "",
        "Đã thanh toán": String(item?.revenue?.totalPayment ?? ""),
        "Dư nợ cuối kì": String(item?.revenue?.remain ?? ""),
        "Tổng cộng": String(item?.revenue?.totalSumprice ?? ""),
      }));

      rows.push({
        STT: "",
        "Mã khách hàng": "",
        "Tên khách hàng": "",
        "Nhân viên kinh doanh": "",
        "Nguồn khách hàng": "",
        "Ngày tạo": "",
        "Đã thanh toán": "",
        "Dư nợ cuối kì": "",
        "Tổng cộng": String(revenue?.totalSumprice ?? ""),
      });

      const headersCsv = Object.keys(rows[0] || { A: "" });
      const csv = [
        headersCsv.join(","),
        ...rows.map((r) =>
          headersCsv
            .map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`)
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Danh_sach_cong_no_khach_hang.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("export error", e);
      alert("Xuất Excel lỗi. Vui lòng thử lại!");
    } finally {
      setLoading((s) => ({ ...s, export: false }));
    }
  };

  // --- UI
  return (
    <div className="container-fluid revenue-customer-page">
      <h4 className="my-3">{title}</h4>

      {/* Filters */}
      <div className="row g-3 mb-3">
        <div className="col-lg-3 col-md-6 col-sm-12">
          <label className="d-none d-sm-block">Mã khách hàng</label>
          <input
            className="form-control"
            value={params.code ?? ""}
            onChange={(e) => onSearchCode(e.target.value)}
            onBlur={onSearch}
            placeholder="Nhập mã khách hàng"
          />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <label className="d-none d-sm-block">Tên khách hàng</label>
          <input
            className="form-control"
            value={params.name ?? ""}
            onChange={(e) => onSearchName(e.target.value)}
            onBlur={onSearch}
            placeholder="Nhập tên khách hàng"
          />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <label className="d-none d-sm-block">Số điện thoại</label>
          <input
            className="form-control"
            value={params.phone ?? ""}
            onChange={(e) => onSearchPhone(e.target.value)}
            onBlur={onSearch}
            placeholder="Nhập SĐT"
          />
        </div>

        {!isPetAccountant && (
          <div className="col-lg-3 col-md-6 col-sm-12">
            <label>Loại khách hàng</label>
            <select
              className="form-select"
              value={params.isPet ?? ""}
              onChange={(e) => {
                const v = e.target.value || null;
                setParams((p) => ({ ...p, isPet: v === "null" ? null : v }));
                onSearch();
              }}
            >
              {LIST_TYPE.map((t) => (
                <option key={String(t.id)} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        )}

        {!isPetAccountant && (
          <div className="col-lg-3 col-md-6 col-sm-12">
            <label>Trạng thái khách hàng</label>
            <select
              className="form-select"
              value={params.haveDebt ?? ""}
              onChange={(e) => {
                const v = e.target.value || null;
                setParams((p) => ({ ...p, haveDebt: v === "null" ? null : v }));
                onSearch();
              }}
            >
              {LST_DEBT.map((t) => (
                <option key={String(t.id)} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="col-lg-3 col-md-6 col-sm-12">
          <label>Thời gian</label>
          <div className="d-flex gap-2">
            <input type="date" className="form-control"
              onChange={(e) => onSearchCompletedTime(e.target.value, params._toTmp)} />
            <input type="date" className="form-control"
              onChange={(e) => onSearchCompletedTime(params._fromTmp, e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th className="w-1x d-none d-lg-table-cell">STT</th>
              <th>Mã khách hàng</th>
              {canSeeName && <th>Tên khách hàng</th>}
              {canSeeName && <th>Nhân viên kinh doanh</th>}
              <th>Nguồn khách hàng</th>
              <th>Thời gian</th>
              <th>Đã thanh toán</th>
              <th>Dư nợ cuối kì</th>
              <th>Tổng cộng</th>
              <th className="w-1x"></th>
            </tr>
          </thead>
          <tbody>
            {records.map((item, i) => (
              <tr key={item.id} onClick={() => gotoDetail(item)} style={{ cursor: "pointer" }}>
                <td className="text-center d-none d-lg-table-cell">{getIndex(i)}</td>
                <td className="text-wrap">{item.code}</td>
                {canSeeName && <td className="text-wrap">{item.name}</td>}
                {canSeeName && <td className="text-wrap">{item?.saler?.name || ""}</td>}
                <td className="text-wrap">{item?.source ? sourceName(item?.source) : ""}</td>
                <td className="text-wrap">{formatDate(item?.createdAt)}</td>
                <td className="text-wrap">{formatCurrency(item?.revenue?.totalPayment)}</td>
                <td className="text-wrap">{formatCurrency(item?.revenue?.remain)}</td>
                <td className="text-wrap">{formatCurrency(item?.revenue?.totalSumprice)}</td>
                <td className="text-center"><i className="icon ion-ios-arrow-forward" /></td>
              </tr>
            ))}

            {records.length > 0 && canSeeTotals && (
              <>
                <tr>
                  <td />
                  <td />
                  {canSeeName && <td />}
                  {canSeeName && <td className="no-wrap text-end"><b>Dư nợ cuối kì:</b></td>}
                  {!canSeeName && <td className="no-wrap text-end"><b>Dư nợ cuối kì:</b></td>}
                  <td className="no-wrap text-end"><b>{formatCurrency(revenue?.remain)}</b></td>
                  <td className="no-wrap text-end"><b>Đã thanh toán:</b></td>
                  <td className="no-wrap text-end"><b>{formatCurrency(revenue?.totalPayment)}</b></td>
                  <td className="no-wrap text-end"><b>Tổng doanh thu:</b></td>
                  <td className="no-wrap text-end"><b>{formatCurrency(revenue?.totalSumprice)}</b></td>
                  <td />
                </tr>

                <tr>
                  <td>new</td>
                  <td />
                  {canSeeName && <td />}
                  {canSeeName && <td className="no-wrap text-end"><b>Dư nợ cuối kì:</b></td>}
                  {!canSeeName && <td className="no-wrap text-end"><b>Dư nợ cuối kì:</b></td>}
                  <td className="no-wrap text-end"><b>{formatCurrency(testNodeRed?.remain)}</b></td>
                  <td className="no-wrap text-end"><b>Đã thanh toán:</b></td>
                  <td className="no-wrap text-end"><b>{formatCurrency(testNodeRed?.totalPayment)}</b></td>
                  <td className="no-wrap text-end"><b>Tổng doanh thu:</b></td>
                  <td className="no-wrap text-end"><b>{formatCurrency(testNodeRed?.totalSumprice)}</b></td>
                  <td />
                </tr>

                <tr>
                  <td />
                  <td colSpan={7} className="no-wrap text-end"></td>
                  <td className="no-wrap text-end">
                    <button className="btn btn-info" onClick={exportExcel} disabled={loading.export}>
                      {loading.export ? "Đang xuất..." : "Xuất file excel"}
                    </button>
                  </td>
                  <td />
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xác thực */}
      {showAuth && (
        <div className="modal-backdrop-custom" onClick={() => setShowAuth(false)}>
          <div className="modal-dialog modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-body">
                <h4 style={{ textAlign: "center" }}>Xác nhận mật khẩu</h4>
                <input
                  type="password"
                  className="form-control"
                  style={{ borderRadius: 0, textAlign: "center" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={handleAuthEnter}
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
