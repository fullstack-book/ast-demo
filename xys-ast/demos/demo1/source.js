function a(num) {
  const ddd = 10;
  return num * 2;
}
function b(x, y) {
  return a(x + y);
}
function c(x, y) {
  return a(x) + b(x, y);
}
function tt() {
  const k = 10;
  const j = 28;
  const kk = k + j;
  return kk;
}
tt();

b();