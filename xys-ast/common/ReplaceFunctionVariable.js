/**
 * 函数变量替换
 */

const types = require("@babel/types");

// traverse_refactored 对象包含了遍历过程中需要应用的方法
const traverse_refactored = {
    // 对于函数声明节点的处理
    FunctionDeclaration(path) {
        replaceVariable(path);
    },
    // 对于函数表达式节点的处理，包括箭头函数和普通函数
    FunctionExpression(path) {
        replaceVariable(path);
    },
    // 对于箭头函数表达式节点的处理
    ArrowFunctionExpression(path) {
        replaceVariable(path);
    }
};

// replaceVariable 函数用于替换一个函数作用域内部的变量
function replaceVariable(path) {
    // 存储函数参数名字以避免对它们进行替换
    let functionParameters = new Set();
    // 存储局部变量的名称及其初始化值
    let localVars = new Map();

    // 将所有函数参数的名称添加到 functionParameters 集合中
    path.node.params.forEach((param) => {
        functionParameters.add(param.name);
    });

    // 通过traverse方法在函数内部继续遍历节点
    path.traverse({
        // 针对变量声明节点的处理
        VariableDeclarator(innerPath) {
            // 如果变量是通过数字或字符串字面量进行初始化的
            if ((types.isNumericLiteral(innerPath.node.init) || types.isStringLiteral(innerPath.node.init)) && innerPath.node.id.name) {
                // 确保这个变量声明发生在当前函数作用域内
                if (innerPath.scope.block === path.scope.block) {
                    // 将变量及其值存储至localVars映射中
                    localVars.set(innerPath.node.id.name, innerPath.node.init.value);
                }
            }
        },
        // 针对一元表达式节点的处理
        UnaryExpression(innerPath) {
            // 如果一元表达式的操作数是一个标识符并且在局部变量映射中可以找到
            if (types.isIdentifier(innerPath.node.argument) && localVars.has(innerPath.node.argument.name)) {
                const variableValue = localVars.get(innerPath.node.argument.name);
                // 只有当操作数是数字或布尔值时，一元操作才有意义
                if (typeof variableValue === 'number' || typeof variableValue === 'boolean') {
                    let newValue;
                    // 根据一元操作符的类型计算新值
                    switch (innerPath.node.operator) {
                        case '-':
                            newValue = -variableValue;
                            break;
                        case '+':
                            newValue = +variableValue;
                            break;
                        case '!':
                            newValue = !variableValue;
                            break;
                        case '~':
                            newValue = ~variableValue;
                            break;
                        case 'typeof':
                            newValue = typeof variableValue;
                            break;
                        default:
                            // 如果不是上述操作符之一，则不进行处理
                            return;
                    }
                    // 创建新的字面量节点
                    const newNode = types.valueToNode(newValue);
                    if (newNode) {
                        // 使用新节点替换原始的一元表达式节点
                        innerPath.replaceWith(newNode);
                    }
                }
            }
        },
        // 处理函数调用表达式节点
        CallExpression(innerPath) {
            innerPath.node.arguments.forEach((arg, index) => {
                // 如果参数是一个标识符
                if (types.isIdentifier(arg)) {
                    const binding = innerPath.scope.getBinding(arg.name);
                    // 确保只替换当前作用域的局部变量，并且不是函数参数
                    if (binding && binding.scope.block === path.scope.block &&
                        !functionParameters.has(arg.name) && localVars.has(arg.name)) {
                        const value = localVars.get(arg.name);
                        // 创建对应类型的字面量节点来替换参数
                        const newNode = types.valueToNode(value);
                        innerPath.node.arguments[index] = newNode;
                    }
                }
            });
        }
    });
}

// 将处理函数 export 出去，这样其他模块可以引用
exports.fix = traverse_refactored;