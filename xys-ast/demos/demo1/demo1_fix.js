
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const IfWithExpressFix = require('../../common/IfWithExpressFix')
const ForWithExpressFix = require('../../common/ForWithExpressFix')
const VariableDeclaratorSeqExpFix = require('../../common/VariableDeclaratorSeqExpFix')
const ReturnSequenceExpressionFix = require('../../common/ReturnSequenceExpressionFix')
const AssignmentWithConditionalFix = require('../../common/AssignmentWithConditionalFix')
const LogicalExpressionFix = require('../../common/LogicalExpressionFix')
const CleanIfEmptyBlockIfFix = require('../../common/CleanIfEmptyBlockIfFix')
const ReplaceFunctionVariable = require('../../common/ReplaceFunctionVariable')
const CleanUnreferVarsFunsFix = require('../../common/CleanUnreferVarsFunsFix')


function fix(source_code) {
    let ast = parser.parse(source_code)
    // 格式修复
    traverse(ast, IfWithExpressFix.fix)
    // traverse(ast, ForWithExpressFix.fix)
    // traverse(ast, ReturnSequenceExpressionFix.fix)


    // // 内容修复
    // traverse(ast, VariableDeclaratorSeqExpFix.fix)

    // traverse(ast, AssignmentWithConditionalFix.fix)

    // traverse(ast, LogicalExpressionFix.fix)
    // traverse(ast, CleanIfEmptyBlockIfFix.fix)
    // traverse(ast, ReplaceFunctionVariable.fix)

    // Test.deal(ast)
    
    // traverse(ast, CleanUnreferVarsFunsFix.fix)
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