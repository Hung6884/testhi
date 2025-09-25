const repo = require('../repositories/cashbook.repository');

// helpers chuẩn hoá start/end of day (giống Java)
function startOfDayMs(ms) {
  if (!ms) return null;
  const d = new Date(Number(ms));
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function endOfDayMs(ms) {
  if (!ms) return null;
  const d = new Date(Number(ms));
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

exports.getList = async (body) => {
  const p = { ...body };
  const { rows, count } = await repo.findAndCount(p);
  return { list: rows, count };
};

exports.getTotal = async (body) => {
  const p = { ...body };
  if (p.fromDate) p.fromDate = startOfDayMs(p.fromDate);
  if (p.toDate)   p.toDate   = endOfDayMs(p.toDate);

  const totals = await repo.total(p);
  return totals;
};
