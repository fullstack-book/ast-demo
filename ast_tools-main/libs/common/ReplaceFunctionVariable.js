/**
 * 相同作用域的变量替换
    例子：
    function tt() {
        const a = 2;
        function d(x, y) {
            return c(x, y + a);
        }
        const k = d(1, 2); 
        const j = d(a, 5);

        const kk = k + j;
        return kk;
    }

    转化后：
    function tt() {
        const a = 2;
        function d(x, y) {
            return c(x, y + a); // 外部变量不能替换，如有需要，手动替换
        }
        const k = d(1, 2);
        const j = d(2, 5); // 这里替换了
        const kk = k + j;
        return kk;
    }
 */

// 引入@babel/types模块，它提供了构建、遍历和管理AST节点的能力
const types = require("@babel/types");

// 定义一个traverse_refactored对象，它包含FunctionDeclaration方法，用于处理遍历到的功能声明节点
const traverse_refactored = {
    FunctionDeclaration(path) {
        // 对遍历到的函数声明节点应用replaceVariable函数
        replaceVariable(path);
    }
};

// replaceVariable函数用于替换函数声明中的变量
function replaceVariable(path) {
    // 检查函数声明节点是否有名称（避免匿名函数的情况）
    if (path.node.id && path.node.id.name) {
        // 创建一个Set用来存储函数参数名字
        let functionParameters = new Set();
        // 创建一个Map用来存储局部变量名和它们的初始化值
        let localVars = new Map();

        // 遍历函数的参数并将它们的名字添加到functionParameters中
        path.node.params.forEach((param) => {
            functionParameters.add(param.name);
        });

        // 再次遍历AST，寻找变量声明
        path.traverse({
            VariableDeclarator(innerPath) {
                if ((types.isNumericLiteral(innerPath.node.init) || types.isStringLiteral(innerPath.node.init)) && innerPath.node.id.name) {
                    if(innerPath.scope.block === path.scope.block){
                        localVars.set(innerPath.node.id.name, innerPath.node.init.value);
                    }
                }
            },
            UnaryExpression(path) {
                if (types.isIdentifier(path.node.argument) && localVars.has(path.node.argument.name)) {
                    const variableValue = localVars.get(path.node.argument.name);
                    if (typeof variableValue === 'number' || typeof variableValue === 'boolean') {
                        let newValue;
                        switch (path.node.operator) {
                            case '-':
                                newValue = -variableValue;
                                break;
                            case '+':
                                newValue = +variableValue; // 对数值应用一元加操作，通常用于类型转换
                                break;
                            case '!':
                                newValue = !variableValue; // 逻辑非操作
                                break;
                            case '~':
                                newValue = ~variableValue; // 按位非操作
                                break;
                            case 'typeof':
                                // typeof 操作的特殊处理，因为它的操作数可能是任何类型
                                newValue = typeof variableValue; // 直接返回操作数的类型
                                break;
                            default:
                                return; // 如果是未处理的操作符，什么也不做
                        }

                        // 创建一个新的字面量节点来替换一元表达式
                        // 注意：typeof 操作符返回的是字符串，因此需要特殊处理
                        const newNode = path.node.operator === 'typeof' ?
                            types.stringLiteral(newValue) :
                            (typeof newValue === 'number' ? types.numericLiteral(newValue) :
                                typeof newValue === 'boolean' ? types.booleanLiteral(newValue) :
                                    null);

                                // 也可以使用types.valueToNode(值)来创建字面量节点
                        if (newNode) {
                            path.replaceWith(newNode);
                        }
                    }
                }
            }
        });
        // 再次遍历AST，这次寻找调用表达式
        path.traverse({
            CallExpression(innerPath) {
                // 遍历调用表达式的参数
                // if (innerPath.scope.block === path.scope.block) {
                    innerPath.node.arguments.forEach((arg, index) => {
                        // 如果参数是一个标识符，并且存在于localVars中但不在functionParameters中
                        if (types.isIdentifier(arg) && !functionParameters.has(arg.name) && localVars.has(arg.name) ) {
                            // 从localVars获取该变量的值
                            const value = localVars.get(arg.name);
                            // 根据值的类型创建一个新的字面量节点
                            const newNode = typeof value === 'number' ? types.numericLiteral(value) : types.stringLiteral(value);
                            // 将参数替换为新创建的字面量节点
                            innerPath.node.arguments[index] = newNode;
                        }
                    });
                // }
                
            }
        });
    }
}

// 导出修改后的traverse_refactored对象，使它可以在其他模块中被引用
exports.fix = traverse_refactored;