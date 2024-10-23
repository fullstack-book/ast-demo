
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const types = require("@babel/types");

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
    // traverse(ast, IfWithExpressFix.fix)
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

    function isExpressionConstant(PathOrNode)
{

    let node = PathOrNode.node || PathOrNode;

    let BrowList = ['window', 'document', 'navigator', 'location', 'history', 'screen',];

    if (types.isLiteral(node) && node.value != null)
    {
        return true;
    }

    if (types.isIdentifier(node) && BrowList.includes(node.name))
    {
        return true;
    }

    if (types.isIdentifier(node) && typeof globalThis[node.name] != "undefined") {
        return true;
    }

    if (types.isMemberExpression(node))
    {
        let {object,property} = node;

        if (types.isIdentifier(object) && typeof globalThis[object.name] != "undefined")
        {
            let properName = types.isIdentifier(property) ? property.name : property.value;
            if (typeof globalThis[object.name][properName] != "undefined") {
                return true;
            }
        }

        if (types.isMemberExpression(object))
        {
            return isExpressionConstant(object);
        }

    }

    if (types.isUnaryExpression(node) && ["+", "-", "!","typeof","~"].includes(node.operator)) {
        return isExpressionConstant(node.argument);
    }

    return false;
}

const restoreVarDeclarator =
{
    VariableDeclarator(path) {
        let scope = path.scope;
        let { id, init } = path.node;

        if (!types.isIdentifier(id) || init == null || !isExpressionConstant(init)) {
            return;
        }

        const binding = scope.getBinding(id.name);

        if (!binding) return;

        let { constant, referencePaths, constantViolations } = binding;  

        if (constantViolations.length > 1) {
            return;
        }

        if (constant || constantViolations[0] == path) {
            for (let referPath of referencePaths) {
                referPath.replaceWith(init);
            }
        }
    },
}

traverse(ast, restoreVarDeclarator);

    const CalcCallExpression = {

        FunctionDeclaration(path) {
            let { node, parentPath } = path;
    
            let { id, body, params } = node;
    
            if (params.length == 0 || !types.isReturnStatement(body.body.at(-1))) {
                return;
            }
    
            const binding = parentPath.scope.getBinding(id.name);
    
            if (!binding || !binding.constant)
                return;
    
            let sourceCode = path.toString();
    
            if (sourceCode.includes("try") || sourceCode.includes("random") || sourceCode.includes("Date")) {
                //返回值不唯一不做处理
                return;
            }
    
            try {
                //直接eval，如果缺环境，让其主动报错，再补上即可。下同,函数声明eval不会报错。
                globalThis[id.name] = eval(`(${sourceCode})`);
    
                let canRemoved = true;
    
                for (const referPath of binding.referencePaths) {
                    let { parentPath, node } = referPath;
                    if (!parentPath.isCallExpression({ "callee": node })) {
                        canRemoved = false;
                        continue;
                    }
    
                    const args = parentPath.get("arguments").map(arg => arg.evaluate().value);
    
                    if (args.length == 0 || args.includes(undefined)) {
                        canRemoved = false;
                        continue;
                    }
    
                    let value = globalThis[id.name].apply(null, args); //计算结果
                    if (typeof value == "function" || typeof value == "undefined") {
                        canRemoved = false;
                        continue;
                    }
                    console.log(parentPath.toString(), "-->", value);
                    parentPath.replaceWith(types.valueToNode(value)); //替换
                }
    
                canRemoved && path.remove();
    
            } catch (e) { }
    
        },
    }
    
    traverse(ast, CalcCallExpression);

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