const types = require("@babel/types");
const traverse_returnSeqFix = {
    ReturnStatement(path) {
        fix(path)
    }
}

function fix(path) {
    const node = path.node;
    if (types.isSequenceExpression(node.argument)) {
        const arguments = node.argument.expressions;
        const seqs = [];
        const parent = path.parentPath.node; // 应该在parentPath上获得node
        for (var ids = 0; ids < arguments.length; ids++) {
            var argument = arguments[ids];
            seqs.push(types.expressionStatement(argument)); // 直接将argument传入
        }
        switch (parent.type) {
            case 'SwitchCase':
                const consequent = parent.consequent;
                for (var ids = 0; ids < seqs.length - 1; ids++) {
                    consequent.splice(consequent.indexOf(node), 0, seqs[ids]);
                }
                node.argument = arguments[arguments.length-1]; // 直接赋值最后一个表达式
                break
            case 'Program':
            case 'BlockStatement':
                const body = parent.body;
                for (var ids = 0; ids < seqs.length - 1; ids++) {
                    body.splice(body.indexOf(node), 0, seqs[ids]);
                }
                node.argument = arguments[arguments.length-1]; // 直接赋值最后一个表达式
                break
            default:
                console.log("出现未知拥有逗号表达式的return未处理");
                break;
        }
    }
}

exports.fix = traverse_returnSeqFix;