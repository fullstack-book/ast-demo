
const fs = require("fs");
const iconv = require('iconv-lite');

const demoPath = "demo2"

const common_fix = require(`./demos/${demoPath}/demo_fix`);
const source_path = `./demos/${demoPath}/source.js`;
const output_path = `./demos/${demoPath}/output.js`;

const content = fs.readFileSync(source_path, { encoding: "binary" });
const buf = new Buffer.from(content, "binary");
const source_code = iconv.decode(buf, "utf-8");

const start_time = new Date().getTime();
const output_ast = common_fix.fix(source_code);

fs.writeFile(
  output_path,
  output_ast,
  { flag: "w", encoding: "utf-8", mode: "0666" },
  function (err) {
    if (err) {
      console.log(
        output_path,
        new Date().getTime() - start_time,
        "ms",
        "文件写入失败"
      );
    } else {
      console.log(
        output_path,
        new Date().getTime() - start_time,
        "ms",
        "文件写入成功"
      );
    }
  }
);
