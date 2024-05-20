function test(a, b) {
    const k = 1;
    const j = 2;
    function add(x, y) {
      return x + y;
    }
    const res = add(a + k, b + j);
    return res;
  }