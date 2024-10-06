/**
 * 清除if语句中的空的代码块，例如：
    if (someCondition) {
    } else {
        doSomething();
    }

    if (someCondition) {
        doSomething();
    } else {
    }

    转化后：
    if (!someCondition) {
        doSomething();
    }
    if (someCondition) {
        doSomething();
    }
 */

const types = require("@babel/types");

// traverse_ifblock 对象定义了对IfStatement类型节点的处理
const traverse_ifblock = {
    IfStatement(path) {
        simplifyEmptyBlocks(path);
    }
};

// 简化空的代码块（consequent 或 alternate）
function simplifyEmptyBlocks(path) {
    const node = path.node;

    // 移除空的 consequent 块（例如 `if (condition) {} else { something }` 转换成 `if (!condition) { something }`）
    if (isEmptyBlockStatement(node.consequent)) {
        // 生成新的if语句：测试条件取反，原来的alternate变为新的consequent，没有else分支
        const newNode = types.ifStatement(
            types.unaryExpression('!', node.test),
            node.alternate
        );
        path.replaceWith(newNode);
        return;
    }

    // 移除空的 alternate 块（例如 `if (condition) { something } else {}` 仍然是 `if (condition) { something }`）
    if (isEmptyBlockStatement(node.alternate)) {
        // 生成新的if语句：保持原来的测试条件和consequent，移除else分支
        const newNode = types.ifStatement(
            node.test,
            node.consequent
        );
        path.replaceWith(newNode);
        return;
    }
}

// 检查 AST 节点是否为一个空的 BlockStatement
function isEmptyBlockStatement(statement) {
    return types.isBlockStatement(statement) && statement.body.length === 0;
}

exports.fix = traverse_ifblock;