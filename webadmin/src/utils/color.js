import isString from 'lodash/isString';

export function stringToColour(str = '') {
  let hash = 0;
  str
    ?.toString()
    .split('')
    .forEach((char) => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, '0');
  }
  return colour;
}

export function statusColor(status) {
  if (!isString(status)) {
    return '';
  }
  switch (status.toLowerCase()) {
    case 'open':
      return '#F9C001';
    case 'inprogress':
      return '#DB6715';
    case 'done':
      return '#208442';
    case 'cancel':
      return '#B0B0B0';
    case 'rejected':
      return '#B0B0B0';
  }
}
