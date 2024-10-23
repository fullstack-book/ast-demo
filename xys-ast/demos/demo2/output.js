var encrypt_lookup = ["Z", "m", "s", "e", "r", "b", "B", "o", "H", "Q", "t", "N", "P", "+", "w", "O", "c", "z", "a", "/", "L", "p", "n", "g", "G", "8", "y", "J", "q", "4", "2", "K", "W", "Y", "j", "0", "D", "S", "f", "d", "i", "k", "x", "3", "V", "T", "1", "6", "I", "l", "U", "A", "F", "M", "9", "7", "h", "E", "C", "v", "u", "R", "X", "5"];
function encrypt_mcr(t) {
  var U = {
    "lTHdy": function (t, e) {
      return t === e;
    },
    "ZofOU": function (t, e) {
      return t < e;
    },
    "sgomx": function (t, e) {
      return t ^ e;
    },
    "vTINI": function (t, e) {
      return t & e;
    },
    "JGAgI": function (t, e) {
      return t < e;
    },
    "kEjQs": function (t, e) {
      return t ^ e;
    },
    "qTbeY": function (t, e) {
      return t ^ e;
    },
    "bjbAy": function (t, e) {
      return t >>> e;
    },
    "lxMGQ": function (t, e) {
      return t >>> e;
    }
  };
  for (var H, V, W = U, X = 256, Y = []; X--; Y[X] = W["lxMGQ"](H, 0)) for (V = 8, H = X; V--;) H = W["vTINI"](H, 1) ? W["lxMGQ"](H, 1) ^ 3988292384 : W["lxMGQ"](H, 1);
  return function (t) {
    if (W["lTHdy"](typeof t, "string")) {
      for (var r = 0, n = -1; W["ZofOU"](r, t["length"]); ++r) n = W["sgomx"](Y[W["vTINI"](n, 255) ^ t["charCod" + "eAt"](r)], n >>> 8);
      return W["sgomx"](n, -1) ^ 3988292384;
    }
    for (r = 0, n = -1; W["JGAgI"](r, t["length"]); ++r) n = W["kEjQs"](Y[W["qTbeY"](W["vTINI"](n, 255), t[r])], W["bjbAy"](n, 8));
    return W["qTbeY"](W["qTbeY"](n, -1), 3988292384);
  };
}
function encrypt_encodeUtf8(t) {
  var m = {
    bIGxm: function (t, e) {
      return t(e);
    },
    MahgM: function (t, e) {
      return t < e;
    },
    czxKn: function (t, e) {
      return t === e;
    },
    clYIu: function (t, e) {
      return t + e;
    }
  };
  var y = m["bIGxm"](encodeURIComponent, t);
  var w = [];
  for (var _ = 0; m["MahgM"](_, y["length"]); _++) {
    var E = y["charAt"](_);
    if (m["czxKn"](E, "%")) {
      var x = y["charAt"](m["clYIu"](_, 1)) + y["charAt"](m["clYIu"](_, 2));
      var k = parseInt(x, 16);
      w["push"](k);
      _ += 2;
    } else w["push"](E["charCod" + "eAt"](0));
  }
  return w;
}
function encrypt_encodeChunk(t, e, r) {
  var y = {
    hwomB: function (t, e) {
      return t < e;
    },
    iHUeL: function (t, e) {
      return t & e;
    },
    ELxEv: function (t, e) {
      return t << e;
    },
    lBuRH: function (t, e) {
      return t << e;
    },
    SkIJl: function (t, e) {
      return t & e;
    },
    JYxWY: function (t, e) {
      return t + e;
    },
    CxjtF: function (t, e) {
      return t(e);
    }
  };
  var w = [];
  for (var _ = e; y["hwomB"](_, r); _ += 3) {}
  return w["join"]("");
}
function encrypt_b64Encode(t) {
  var V = {
    udFrB: function (t, e) {
      return t % e;
    },
    cCZFe: function (t, e) {
      return t === e;
    },
    jevwl: function (t, e) {
      return t - e;
    },
    aqlTy: function (t, e) {
      return t + e;
    },
    rceYY: function (t, e) {
      return t >> e;
    },
    OwjMq: function (t, e) {
      return t & e;
    },
    kSGXO: function (t, e) {
      return t << e;
    },
    veNiI: function (t, e) {
      return t === e;
    },
    QLthP: function (t, e) {
      return t + e;
    },
    wDtJz: function (t, e) {
      return t + e;
    },
    nYqUQ: function (t, e) {
      return t & e;
    },
    TCArD: function (t, e) {
      return t << e;
    },
    RHteb: function (t, e) {
      return t - e;
    },
    mZPJZ: function (t, e) {
      return t < e;
    },
    zDETq: function (t, e, r, n) {
      return t(e, r, n);
    },
    YlZGp: function (t, e) {
      return t > e;
    }
  };
  for (var z = ("0|3|2|1" + "|5|6|4|" + "7")["split"]("|"), X = 0;;) {
    switch (z[X++]) {
      case "0":
        var Y;
        continue;
      case "1":
        var K = [];
        continue;
      case "2":
        var J = V["udFrB"]($, 3);
        continue;
      case "3":
        var $ = t["length"];
        continue;
      case "4":
        V["cCZFe"](J, 1) ? (Y = t[V["jevwl"]($, 1)], K["push"](V["aqlTy"](encrypt_lookup[V["rceYY"](Y, 2)] + encrypt_lookup[V["OwjMq"](V["kSGXO"](Y, 4), 63)], "=="))) : V["veNiI"](J, 2) && (Y = V["kSGXO"](t[$ - 2], 8) + t[V["jevwl"]($, 1)], K["push"](V["QLthP"](V["wDtJz"](encrypt_lookup[Y >> 10], encrypt_lookup[V["OwjMq"](Y >> 4, 63)]) + encrypt_lookup[V["nYqUQ"](V["TCArD"](Y, 2), 63)], "=")));
        continue;
      case "5":
        continue;
      case "6":
        for (var Z = 0, tt = V["RHteb"]($, J); V["mZPJZ"](Z, tt); Z += 16383) K["push"](V["zDETq"](encrypt_encodeChunk, t, Z, V["YlZGp"](Z + 16383, tt) ? tt : V["wDtJz"](Z, 16383)));
        continue;
      case "7":
        return K["join"]("");
    }
    break;
  }
}
// const x_t = "1714311666149"; // 注意字符串类型
// const x_s =
//   "XYW_eyJzaWduU3ZuIjoiNTEiLCJzaWduVHlwZSI6IngxIiwiYXBwSWQiOiJ4aHMtcGMtd2ViIiwic2lnblZlcnNpb24iOiIxIiwicGF5bG9hZCI6ImQ4M2I2NTY0OTY2ZGQzZDdmYzRlNzM0NTA5M2VlM2U1ZWRiZjc0NjcyMDExOTI5OGU0YjBjMzE1Zjg2MTI0ZDFhMTc4NGQ1NGY4MDc1NWY2NzQzODhlNGU5MGRkYTVkYmM5ZTNiZmRhMWZhYTFlYjkwZDc0YWEzMWI1NGM3MmNkMGQ3NGFhMzFiNTRjNzJjZGFjNDg5YjlkYThjZTVlNDhmNGFmYjlhY2ZjM2VhMjZmZTBiMjY2YTZiNGNjM2NiNTYzZWVmZTgyNjdmNDI3ZWY4ZmUyMzFhNTU3MzFhZDFkMTk1ZjJlZGYzNzQyMDRmYzEwZTA3ZWE2NDIyZjQzNzU0MGYxNTkwN2Q3NTdkYzliZjUyOTA3MWY3ZjFjZjI4MTg2YWM3NzgzNjMxZjkxNTQ4MWEwNjkxOTA1YWYxNTI4MDZiNTI5NzQxYjBiMzMzNGM0OGIxNzU4NmFhMDkzOWFlOGU3YTY1OGYyY2Y3NDQ2NWFlNjViNmY1ODNmMjlhYyJ9";
// const a1 = "18edb7f2bd42lt1c2dtnnpsndf4ehxqnad4d9ix7630000373454";
// const b1 =
//   "I38rHdgsjopgIvesdVwgIC+oIELmBZ5e3VwXLgFTIxS3bqwErFeexd0ekncAzMFYnqthIhJeD9MDKutRI3KsYorWHPtGrbV0P9WfIi/eWc6eYqtyQApPI37ekmR1QL+5Ii6sdnoeSfqYHqwl2qt5B0DoIvMzOZQqZVw7IxOeTqwr4qtiIkrOIi/skccxICLdI3Oe0utl2ADZsLveDSKsSPw5IEvsiutJOqw8BVwfPpdeTDWOIx4VIiu6ZPwbPut5IvlaLbgs3qtxIxes1VwHIkumIkIyejgsY/WTge7sjutKrZgedWI9gfKeWIFGI36eWPwyIEJefut0ocVAPBLLI3Aeiqt3cZ7sVom4IESyIhEy4o4AI3Mn4F4gIiifpVwAICZVJo3sWWJs1qw3IvAednvej0TyIi5e6pLS8qwUIE7s1fds6WAeiVwqed5sdut3IxILbd6sdqtDbgKs0PwgIv8aI3z5rqwGBVtwzfTsKD7sdBdskut+Iioed/As1SiiIk/sjD7s3niAIkoe6Vt1IkikwPwwNVt9I3oe6utdIkJsTqwiIEKsfPtA+qwKsuw7IvHhIxugGnWDKWgexPtVIhiKIi6eDqwnrl42pa5sWUzkIkWo4VtPmqwCIv3e3qtfPLeeVY0sTbEyIEJekdgs3PtsnPwqI35sSPt0Ih/sV04TIk0ejjNsfqw7Iv3sVut04B8qIkWyIvKsxFOeknve0FAsYPtKIiMFI3MurVtKIvzjIh6s6lFut//sWqtaI3IozVwWPS/eW0NsfVtznPtzI3qUIiIH/VtqwuwtI30sdmveVuwscPw2IicNcuwdIC4Lp9SbIE0eSj7ejBAs3Vwc+qtLIiczIx6sYqtYIE/edrkfICD+/F8OIv+BIvAekPw5/qtaPqwuICbiIk5e39vskPt1mIRRIx+tOutPOVwHI3u=";
// const x_s_common = get_x_s_common(x_t, x_s, a1, b1);
// console.log(x_s_common);
console.log(encrypt_encodeUtf8(JSON.stringify({
  a: 1
})));
console.log(encrypt_b64Encode(encrypt_encodeUtf8(JSON.stringify({
  a: 1
}))));
console.log(encrypt_mcr()("1"));