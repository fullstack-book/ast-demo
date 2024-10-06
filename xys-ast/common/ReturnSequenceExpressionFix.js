/**
 * 将ReturnStatement中包含的SequenceExpression（逗号表达式）拆解成多个独立的表达式语句
    例子1：
    function example() {
    return (a(), b(), c());
    }

    转换为：
    function example() {
        a();
        b();
        return c();
    }

    例子2：
    function test() {
        return a = 1, b= 2, a + b;   
    }

    转换为：
    function test() {
        a = 1;
        b = 2;
        return a + b;
    }

 */


// 引入Babel类型模块
const types = require("@babel/types");

// 创建一个对象用于处理ReturnStatement节点
const traverse_returnSeqFix = {
    ReturnStatement(path) {
        fix(path); // 调用fix函数处理ReturnStatement节点
    }
}

// 定义修复函数
function fix(path) {
    const node = path.node; // 获取当前路径的节点

    // 检查ReturnStatement的argument是否是SequenceExpression（逗号表达式）
    if (types.isSequenceExpression(node.argument)) {
        const arguments = node.argument.expressions; // 获取逗号表达式中的所有子表达式
        const seqs = []; // 创建一个数组存放转换后的表达式语句
        const parent = path.parentPath.node; // 获取父节点

        // 遍历所有子表达式，将它们转换为表达式语句并添加到seqs数组中
        for (var ids = 0; ids < arguments.length; ids++) {
            let argument = arguments[ids];
            seqs.push(types.expressionStatement(argument)); // 创建表达式语句并加入数组
        }

        // 根据父节点类型进行处理
        switch (parent.type) {
            case 'SwitchCase':
                const consequent = parent.consequent; // 获取SwitchCase的consequent数组
                // 在consequent数组中插入转换后的表达式语句
                for (let ids = 0; ids < seqs.length - 1; ids++) {
                    consequent.splice(consequent.indexOf(node), 0, seqs[ids]);
                }
                node.argument = arguments[arguments.length - 1]; // 将ReturnStatement的argument设置为最后一个子表达式
                break;

            case 'Program':
            case 'BlockStatement':
                const body = parent.body; // 获取Program或BlockStatement的body数组
                // 在body数组中插入转换后的表达式语句
                for (let ids = 0; ids < seqs.length - 1; ids++) {
                    body.splice(body.indexOf(node), 0, seqs[ids]);
                }
                node.argument = arguments[arguments.length - 1]; // 将ReturnStatement的argument设置为最后一个子表达式
                break;

            default:
                console.log("出现未知拥有逗号表达式的return未处理");
                break;
        }
    }
}

// 导出traverse_returnSeqFix对象
exports.fix = traverse_returnSeqFix;
