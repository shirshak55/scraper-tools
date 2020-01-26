export default (array: Array<any>, size: number) => {
  var results = [];
  while (array.length) {
    results.push(array.splice(0, size));
  }
  return results;
};
