/**
 * 逻辑表达式（&& 或 ||）时，转换为对应的 if 或 if-else 语句
    例子：
    let a = 5;
    a > 3 && (b = 10, c = 20);

    a && (b = 2, c = 3);
    a || (d = 4, e = 5);

    转化后：
    let a = 5;
    if (a > 3) {
        b = 10;
        c = 20;
    }
    if (a) {
        b = 2;
        c = 3;
    }
    if (!a) { } else {
        d = 4;
        e = 5;
    }
 */

// 引入 Babel 类型模块，为了使用它提供的 API 来操作 AST（抽象语法树）
const types = require("@babel/types");

// 定义一个遍历器对象，用于遍历 JavaScript 代码的抽象语法树（AST）中的表达式语句节点
const traverse_forexpress = {
  // 针对“表达式语句”节点的处理函数
  ExpressionStatement(path) {
    // 对匹配到的节点调用 fix 函数进行处理
    fix(path);
  }
};

// 定义一个处理函数，用于转换特定的逻辑表达式
function fix(path) {
  // 获取当前遍历到的节点
  const node = path.node;
  // 检查节点是否为逻辑表达式（逻辑与“&&”或逻辑或“||”）
  if (types.isLogicalExpression(node.expression, { operator: "&&" }) ||
      types.isLogicalExpression(node.expression, { operator: "||" })) {
    
    // 提取逻辑表达式的左侧部分，作为测试条件表达式
    const testExpression = node.expression.left;
    // 获取逻辑表达式的操作符（“&&”或“||”）
    const operator = node.expression.operator;
    // 初始化一个数组，用于存放需要在 if 语句中执行的表达式
    const expressions = [];

    // 检查逻辑表达式的右侧是否为序列表达式（即用逗号分隔的表达式列表）
    if (types.isSequenceExpression(node.expression.right)) {
      // 如果是序列表达式，将其内部的所有表达式提取到 expressions 数组中
      expressions.push(...node.expression.right.expressions);
    } else {
      // 如果不是序列表达式，直接将右侧表达式放入 expressions 数组中
      expressions.push(node.expression.right);
    }

    // 根据操作符构建 if 语句（对于“&&”）或 if-else 语句（对于“||”）
    const ifStatement = operator === "&&" ?
      types.ifStatement(
        testExpression, // 条件测试表达式
        types.blockStatement(expressions.map(exp => types.expressionStatement(exp))) // 如果条件为真，执行的表达式列表
      ) :
      types.ifStatement(
        // 对于“||”，测试表达式取反
        types.unaryExpression("!", testExpression),
        types.blockStatement([]), // 条件为真时不执行任何操作
        // 条件为假时执行的表达式列表
        types.blockStatement(expressions.map(exp => types.expressionStatement(exp)))
      );

    // 用构建好的 if 语句替换原始的逻辑表达式语句
    path.replaceWith(ifStatement);
  }
}

// 导出定义的遍历器对象，以便在 Babel 插件中使用
exports.fix = traverse_forexpress;