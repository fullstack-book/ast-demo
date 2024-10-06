/**
 * 将三元运算符表达式转换为 if 语句
    例子1：
    function test() {
        let a;
        a = condition ? (x ? 1 : 2) : y ? 1 : 2;
    }

    转换为：
    function test() {
        let a;
        if (condition) {
            if (x) {
            a = 1;
            } else {
            a = 2;
            }
        } else {
            if (y) {
            a = 1;
            } else {
            a = 2;
            }
        }
    }

    例子2：
    function test() {
        return condition ? (x ? 1 : 2) : y ? 1 : 2;
    }
    如果在return中使用三元运算符，可以先让返回值手动提取出来，再执行;注意：不能 const a = condition ? (x ? 1 : 2) : y ? 1 : 2; 也不行的
    正确的写法：
    function test() {
        let a;
        a = condition ? (x ? 1 : 2) : y ? 1 : 2;
        return a
    }
 */


// 引入 @babel/types 模块，它提供了构造、验证以及变换 AST 节点的方法
const types = require("@babel/types");

// 定义一个遍历器配置对象，针对表达式语句类型的节点进行操作
const traverse_forexpress = {
    // 当遍历到表达式语句节点时，执行 fixConditionalAssignment 函数
    ExpressionStatement(path) {
        fixConditionalAssignment(path);
    }
};

// 定义一个函数，用来处理赋值表达式中包含的条件表达式，并将其转换成 if 语句
function fixConditionalAssignment(path) {
    // 从路径中获得当前节点
    const { node } = path;
    // 检查当前表达式是否为赋值表达式
    if (types.isAssignmentExpression(node.expression)) {
        // 解构赋值，获取赋值表达式的各个部分
        const { operator, left, right } = node.expression;
        // 检查右侧表达式是否为条件表达式（三元运算符表达式）
        if (types.isConditionalExpression(right)) {
            // 从条件表达式创建一个 if 语句
            const ifStatement = createIfStatementFromConditionalExpression(operator, left, right.test, right.consequent, right.alternate);
            // 使用该 if 语句替换原始的表达式语句
            path.replaceWith(ifStatement);
        }
    }
}

// 定义一个函数，根据赋值表达式中的条件表达式创建 if 语句
function createIfStatementFromConditionalExpression(operator, left, test, consequent, alternate) {
    // 返回一个 if 语句的 AST 节点
    return types.ifStatement(
        test, // if 语句的条件部分
        types.blockStatement([ // if 条件为 true 时执行的代码块
            types.expressionStatement(
                types.assignmentExpression(operator, left, consequent) // true 分支的赋值表达式
            )
        ]), 
        types.blockStatement([ // if 条件为 false 时执行的代码块
            types.expressionStatement(
                types.assignmentExpression(operator, left, alternate) // false 分支的赋值表达式
            )
        ])
    );
}

// 导出配置对象，使其可以在其他地方引入并使用
exports.fix = traverse_forexpress;