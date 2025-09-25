// Mirror các hàm trong com.vinatek.base.utils.DateTimeUtils (Java)

const pad2 = (n) => String(n).padStart(2, '0');

function startOfDay(ms) {
  if (ms == null) return null;
  const d = new Date(Number(ms));
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
}

function endOfDay(ms) {
  if (ms == null) return null;
  const d = new Date(Number(ms));
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
}

function startOfMonth(ms) {
  if (ms == null) return null;
  const d = new Date(Number(ms));
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0).getTime();
}

function endOfMonth(ms) {
  if (ms == null) return null;
  const d = new Date(Number(ms));
  // ngày 0 của tháng kế tiếp = ngày cuối của tháng hiện tại
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
}

function todayStart() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
}

function todayEnd() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
}

function firstDateOfYear() {
  const d = new Date();
  return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0).getTime();
}

function lastDateOfYear() {
  const d = new Date();
  return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999).getTime();
}

function isSameDay(a, b) {
  if (a == null || b == null) return false;
  const d1 = new Date(Number(a));
  const d2 = new Date(Number(b));
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function diffDays(a, b) {
  if (a == null || b == null) return 0;
  const ms = Number(b) - Number(a);
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

// Định dạng giống Java: dd/MM/yyyy HH:mm:ss
function formatDateTimeVN(ms) {
  if (ms == null) return '';
  const d = new Date(Number(ms));
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

// dd/MM/yy
function formatDateShort(ms) {
  if (ms == null) return '';
  const d = new Date(Number(ms));
  const yy = String(d.getFullYear()).slice(-2);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${yy}`;
}

// dd/MM/yyyy
function formatDateVN(ms) {
  if (ms == null) return '';
  const d = new Date(Number(ms));
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// "Hhmm" theo Java's formatTimeVn (ví dụ 14h05)
function formatTimeVn(ms) {
  if (ms == null) return '';
  const d = new Date(Number(ms));
  return `${d.getHours()}h${pad2(d.getMinutes())}`;
}

module.exports = {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  todayStart,
  todayEnd,
  firstDateOfYear,
  lastDateOfYear,
  isSameDay,
  diffDays,
  formatDateTimeVN,
  formatDateShort,
  formatDateVN,
  formatTimeVn,
};
