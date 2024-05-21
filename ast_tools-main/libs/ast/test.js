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
        "b"
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

    traverse(ast, {
        enter(path) {
            // 识别顶级未被引用的函数和变量声明
            if (path.isProgram()) {
                path.traverse({
                    "FunctionDeclaration|VariableDeclaration"(path) {
                        const name = path.node.id ? path.node.id.name : null;

                        // 检查该声明是否被引用
                        if (name && !path.scope.getBinding(name).referenced) {
                            path.remove(); // 移除未被引用的声明
                        } else if (path.isVariableDeclaration()) {
                            // 对于变量声明，检查每个声明的变量是否被引用
                            path.node.declarations.forEach((declaration, index) => {
                                if (!path.scope.getBinding(declaration.id.name).referenced) {
                                    path.get('declarations.' + index).remove();
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}
exports.deal = deal