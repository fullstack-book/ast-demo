
const fs = require('fs');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const jscode = fs.readFileSync('demo.js', 'utf-8');

const ast = parse(jscode, {
    sourceType: 'module' // 支持import和export
})

let visitor = {
    // 遍历AST，查找需要加密的代码
    FunctionDeclaration(path) {
        const parentName = path.node.params[0].name;
        const id = path.node.id.name;
        if (id === "aa") {
            // 局部遍历AST
            path.traverse({
                // 将第一个函数aa的第一个形参
                Identifier(path) {
                    if (path.node.name === parentName) {
                        // 将变量名更换为x
                        path.node.name = 'x';
                    }
                }
            })
        }
    }
}

// 遍历全部AST
traverse(ast, visitor)

const { code } = generate(ast, {
    // comments: false, // 不保留注释
    // concise: true, // 简洁的输出格式
    // minified: true, // 压缩后的输出格式
    // jsescOption: {
    //     minimal: true // 十六进制、unicode编码等还原
    // }
});

fs.writeFileSync('newDemo.js', code, 'utf-8');