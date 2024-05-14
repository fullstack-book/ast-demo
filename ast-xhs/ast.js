
const fs = require('fs');
const parser = require('@babel/parser');
const types = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const jscode = fs.readFileSync('x-s-common.js', 'utf-8');

const ast = parser.parse(jscode, {
    sourceType: 'module' // 支持import和export
})

// 得到解密函数 a0_0x10f4ac 所在节点
const decFun = ast.program.body[2]
// 得到解密函数的名字
const decFunName = decFun.id.name

const newAst = parser.parse("")
newAst.program.body.push(ast.program.body[0])
newAst.program.body.push(ast.program.body[1])
newAst.program.body.push(decFun)
newAst.program.body.push(ast.program.body[3])

const newAstCode = generate(newAst, {
    compact: true,
}).code

eval(newAstCode)

// console.log(a0_0x10f4ac(-66, -73 - 162))

let visitor = {
    CallExpression(path) {
        // 判断是否是解密函数的调用
        if (path.node.callee.name === decFunName) {
            // 修改解密函数的调用
            const binding = path.scope.bindings[decFunName];
            binding && binding.referencePaths.forEach(refPath => {
                refPath.parentPath.isCallExpression() && 
                refPath.parentPath.replaceWith(types.stringLiteral(eval(refPath.parentPath.toString())
                ))
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