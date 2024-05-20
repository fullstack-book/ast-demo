function a(num) {
  return num * 2;
}
function b(x, y) {
  return a(x + y);
}
function c(x, y) {
  return a(x) + b(x, y);
}
function tt() {
  const l = 1;
  function d(x, y) {
    var l = 1;
    return c(x, y + l);
  }
  const k = 10;
  const j = 28;
  const kk = k + j;
  return kk;
}