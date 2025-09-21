/**
 * 数组合并并去重
 * @param arr1 数组1
 * @param arr2 数组2
 */
export function mergeUnique(arr1, arr2) {
  const arr = arr1;
  for (let index = 0, len = arr2.length; index < len; index += 1) {
    if (!arr.includes(arr2[index])) {
      arr.push(arr2[index]);
    }
  }

  return arr;
}

/**
 * 数组去重
 * @param arr 数组
 */
export function unique(arr) {
  const array = [];
  for (let index = 0, len = arr.length; index < len; index += 1) {
    if (!array.includes(arr[index])) {
      array.push(arr[index]);
    }
  }
  return array;
}
