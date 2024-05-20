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
        return c(x, y + l);  
    }
    const k = d(1, 2);
    const j = d(4, 5);

    const kk = k + j;
    return kk;
}

// 相加
function add(a, b) {
    return a + b;
}

function test (a, b){
    const k = 1, j = 2;
    return add(a + k, b + j);
}