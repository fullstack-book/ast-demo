
const encrypt_lookup = ["Z", "m", "s", "e", "r", "b", "B", "o", "H", "Q", "t", "N", "P", "+", "w", "O", "c", "z", "a", "/", "L", "p", "n", "g", "G", "8", "y", "J", "q", "4", "2", "K", "W", "Y", "j", "0", "D", "S", "f", "d", "i", "k", "x", "3", "V", "T", "1", "6", "I", "l", "U", "A", "F", "M", "9", "7", "h", "E", "C", "v", "u", "R", "X", "5"];

function encrypt_mcr(t) {
  const polymod = 3988292384;
  const tableLength = 256;
  const crcTable = [];
  for (let i = 0; i < tableLength; i++) {
    let crc = i;
    for (let j = 8; j > 0; j--) {
      crc = (crc & 1) ? (crc >>> 1) ^ polymod : crc >>> 1;
    }
    crcTable[i] = crc;
  }
  return function (input) {
    if (typeof input === "string") {
      let crc = -1;
      for (let i = 0; i < input.length; i++) {
        crc = crcTable[(crc ^ input.charCodeAt(i)) & 0xFF] ^ (crc >>> 8);
      }
      return (crc ^ (-1)) ^ polymod;
    }
    crc = -1;
    for (let i = 0; i < input.length; i++) {
      crc = crcTable[(crc ^ input[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ (-1)) ^ polymod;
  };
}
function encrypt_encodeUtf8(t) {
  const y = encodeURIComponent(t);
  const w = [];
  for (let i = 0; i < y.length; i++) {
    const E = y[i];
    if (E === '%') {
      const k = parseInt(y.substr(i + 1, 2), 16);
      w.push(k);
      i += 2;
    } else {
      w.push(E.charCodeAt(0));
    }
  }
  return w;
}
function encrypt_tripletToBase64(t) {
  return encrypt_lookup[t >> 18 & 63] +
    encrypt_lookup[t >> 12 & 63] +
    encrypt_lookup[t >> 6 & 63] +
    encrypt_lookup[t & 63];
}
function encrypt_encodeChunk(t, e, r) {
  var w = [];
  for (var _ = e; _ < r; _ += 3) {
    var n = (t[_] << 16) | (t[_ + 1] << 8) | (t[_ + 2]);
    w.push(encrypt_tripletToBase64(n));
  }
  return w.join("");
}
function encrypt_b64Encode(t) {
  var K = [];
  var $ = t.length;
  var J = $ % 3;
  var Q = 16383;

  for (var Z = 0, tt = $ - J; Z < tt; Z += Q) {
    K.push(encrypt_encodeChunk(t, Z, Z + Q > tt ? tt : Z + Q));
  }

  if (J === 1) {
    var Y = t[$ - 1];
    K.push(encrypt_lookup[Y >> 2] + encrypt_lookup[(Y << 4) & 63] + "==");
  } else if (J === 2) {
    var Y = (t[$ - 2] << 8) + t[$ - 1];
    K.push(encrypt_lookup[Y >> 10] + encrypt_lookup[(Y >> 4) & 63] + encrypt_lookup[(Y << 2) & 63] + "=");
  }

  return K.join("");
}
function get_x_s_common(x_t, x_s, a1, b1) {
  const h = {
    s0: 3, // Windows是5，Mac是3
    s1: "",
    x0: "1", // localStorage中'b1b1'的值
    x1: "3.6.8",
    // x2: "Windows",
    x2: "Mac OS",
    x3: "xhs-pc-web",
    x4: "4.14.2", // cookie 中webBuild
    x5: a1, // cookie中'a1'的值
    x6: x_t,
    x7: x_s,
    x8: b1, // localStorage中'b1'的值
    x9: encrypt_mcr()(x_t + x_s + b1),
    x10: 0, // sessionStorage中'sc'的值 Number(sessionStorage.getItem("sc"))，也可以默认0
  };
  const x_s_common = encrypt_b64Encode(encrypt_encodeUtf8(JSON.stringify(h)));
  return x_s_common;
}
const x_t = "1714311666149"; // 注意字符串类型
const x_s =
  "XYW_eyJzaWduU3ZuIjoiNTEiLCJzaWduVHlwZSI6IngxIiwiYXBwSWQiOiJ4aHMtcGMtd2ViIiwic2lnblZlcnNpb24iOiIxIiwicGF5bG9hZCI6ImQ4M2I2NTY0OTY2ZGQzZDdmYzRlNzM0NTA5M2VlM2U1ZWRiZjc0NjcyMDExOTI5OGU0YjBjMzE1Zjg2MTI0ZDFhMTc4NGQ1NGY4MDc1NWY2NzQzODhlNGU5MGRkYTVkYmM5ZTNiZmRhMWZhYTFlYjkwZDc0YWEzMWI1NGM3MmNkMGQ3NGFhMzFiNTRjNzJjZGFjNDg5YjlkYThjZTVlNDhmNGFmYjlhY2ZjM2VhMjZmZTBiMjY2YTZiNGNjM2NiNTYzZWVmZTgyNjdmNDI3ZWY4ZmUyMzFhNTU3MzFhZDFkMTk1ZjJlZGYzNzQyMDRmYzEwZTA3ZWE2NDIyZjQzNzU0MGYxNTkwN2Q3NTdkYzliZjUyOTA3MWY3ZjFjZjI4MTg2YWM3NzgzNjMxZjkxNTQ4MWEwNjkxOTA1YWYxNTI4MDZiNTI5NzQxYjBiMzMzNGM0OGIxNzU4NmFhMDkzOWFlOGU3YTY1OGYyY2Y3NDQ2NWFlNjViNmY1ODNmMjlhYyJ9";
const a1 = "18edb7f2bd42lt1c2dtnnpsndf4ehxqnad4d9ix7630000373454";
const b1 =
  "I38rHdgsjopgIvesdVwgIC+oIELmBZ5e3VwXLgFTIxS3bqwErFeexd0ekncAzMFYnqthIhJeD9MDKutRI3KsYorWHPtGrbV0P9WfIi/eWc6eYqtyQApPI37ekmR1QL+5Ii6sdnoeSfqYHqwl2qt5B0DoIvMzOZQqZVw7IxOeTqwr4qtiIkrOIi/skccxICLdI3Oe0utl2ADZsLveDSKsSPw5IEvsiutJOqw8BVwfPpdeTDWOIx4VIiu6ZPwbPut5IvlaLbgs3qtxIxes1VwHIkumIkIyejgsY/WTge7sjutKrZgedWI9gfKeWIFGI36eWPwyIEJefut0ocVAPBLLI3Aeiqt3cZ7sVom4IESyIhEy4o4AI3Mn4F4gIiifpVwAICZVJo3sWWJs1qw3IvAednvej0TyIi5e6pLS8qwUIE7s1fds6WAeiVwqed5sdut3IxILbd6sdqtDbgKs0PwgIv8aI3z5rqwGBVtwzfTsKD7sdBdskut+Iioed/As1SiiIk/sjD7s3niAIkoe6Vt1IkikwPwwNVt9I3oe6utdIkJsTqwiIEKsfPtA+qwKsuw7IvHhIxugGnWDKWgexPtVIhiKIi6eDqwnrl42pa5sWUzkIkWo4VtPmqwCIv3e3qtfPLeeVY0sTbEyIEJekdgs3PtsnPwqI35sSPt0Ih/sV04TIk0ejjNsfqw7Iv3sVut04B8qIkWyIvKsxFOeknve0FAsYPtKIiMFI3MurVtKIvzjIh6s6lFut//sWqtaI3IozVwWPS/eW0NsfVtznPtzI3qUIiIH/VtqwuwtI30sdmveVuwscPw2IicNcuwdIC4Lp9SbIE0eSj7ejBAs3Vwc+qtLIiczIx6sYqtYIE/edrkfICD+/F8OIv+BIvAekPw5/qtaPqwuICbiIk5e39vskPt1mIRRIx+tOutPOVwHI3u=";
const x_s_common = get_x_s_common(x_t, x_s, a1, b1);
console.log(x_s_common);

// console.log(encrypt_encodeUtf8(JSON.stringify({
//   a: 1
// })));
// console.log(encrypt_b64Encode(encrypt_encodeUtf8(JSON.stringify({
//   a: 1
// }))));
// console.log(encrypt_mcr()("1"))