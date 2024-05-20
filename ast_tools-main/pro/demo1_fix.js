
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const IfWithExpressFix = require('../libs/common/IfWithExpressFix')
const ForWithExpressFix = require('../libs/common/ForWithExpressFix')
const VariableDeclaratorFix = require('../libs/common/VariableDeclaratorFix')
const ReturnSeqFix = require('../libs/common/ReturnSeqFix')
const AssignmentWithConditionalFix = require('../libs/common/AssignmentWithConditionalFix')
const LogicalExpressionFix = require('../libs/common/LogicalExpressionFix')
const CleanEmptyBlockIfFix = require('../libs/common/CleanEmptyBlockIfFix')
const ReplaceFunctionVariable = require('../libs/common/ReplaceFunctionVariable')


function fix(source_code) {
    const ast = parser.parse(source_code)
    // 格式修复
    traverse(ast, IfWithExpressFix.fix)
    traverse(ast, ForWithExpressFix.fix)
    traverse(ast, ReturnSeqFix.fix)


    // // 内容修复
    traverse(ast, VariableDeclaratorFix.fix)

    traverse(ast, AssignmentWithConditionalFix.fix)

    traverse(ast, LogicalExpressionFix.fix)
    traverse(ast, CleanEmptyBlockIfFix.fix)
    traverse(ast, ReplaceFunctionVariable.fix)

    const opts = {
        indent: {
            adjustMultilineComment: true,
            style: "        ",
            base: 0
        }
    }
    return generator(ast, opts).code
}

exports.fix = fix