const types = require("@babel/types");
const traverse = require("@babel/traverse").default;

function deal(ast) {
    let functionString = ""
    const globalFunctionNames = [
        "a0_0x1131",
        "init",
        "a0_0x10f4ac",
        "a0_0x3693",
    ]
    let callFunctionNames = [
        "G",
        // "b",
        // "W",
        // "m"
    ]
    const vistor = {
        FunctionDeclaration(path) {
            if ([...globalFunctionNames, ...callFunctionNames].includes(path.node.id.name)) {
                functionString += path.toString();
            }
        }
    }
    traverse(ast, vistor);
    eval(functionString)


    let visitor2 = {
        FunctionDeclaration(path) {
            // 获取函数名
            let funcName = path.get('id').node.name;

            if (callFunctionNames.includes(funcName)) {
                const bindings = path.scope.getBinding(funcName);

                // 遍历所有绑定
                if (bindings) {
                    bindings.referencePaths.forEach(refPath => {
                        if (refPath.parentPath.isCallExpression()) {
                            try {
                                // 使用eval计算函数调用表达式的结果
                                const calcValue = eval(refPath.parentPath.toString());
                                // 替换函数调用表达式
                                if (typeof calcValue === 'number') {
                                    // 对于数字结果，创建numericLiteral
                                    const numberVal = types.numericLiteral(calcValue);
                                    refPath.parentPath.replaceWith(numberVal);
                                } else if (typeof calcValue === 'string') {
                                    // 对于字符串结果，创建stringLiteral
                                    const stringVal = types.stringLiteral(calcValue);
                                    refPath.parentPath.replaceWith(stringVal);
                                } else {
                                    // 其他类型暂不处理
                                    console.warn(`其他类型的结果，暂不处理: ${calcValue}`);
                                }
                            } catch (e) {
                            }
                        }
                    });
                }
            }
        }
    };
    traverse(ast, visitor2);
}
exports.deal = deal