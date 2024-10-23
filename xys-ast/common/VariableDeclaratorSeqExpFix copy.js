/**
 * 变量声明拆分和表达式拆分
    例子:
    var a = 1, b = 2;
    a = 1, b = 2;

    转化为：
    var a = 1;
    var b = 2;
    a = 1;
    b = 2;
 */

// 导入@babel/types模块以便使用其辅助函数
const types = require("@babel/types");

const variableDeclaratorSeqExpFix =
{
    VariableDeclaration(path) {
        let { parentPath, node } = path;
        if (parentPath.isFor()) {
            return;
        }
        let { declarations, kind } = node;

        if (declarations.length == 1) {
            return;
        }

        let newNodes = [];

        for (const varNode of declarations) {
            let newDeclartionNode = types.VariableDeclaration(kind, [varNode]);
            newNodes.push(newDeclartionNode);
        }

        path.replaceWithMultiple(newNodes);

    },
}

// 导出修复函数，便于外部模块调用
exports.fix = variableDeclaratorSeqExpFix;