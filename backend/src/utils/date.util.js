function stripTime(dateStr) {
  const date = new Date(dateStr);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

module.exports = {
  stripTime,
};
