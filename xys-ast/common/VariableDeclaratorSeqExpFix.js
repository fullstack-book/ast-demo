/**
 * 变量声明拆分和表达式拆分
    例子:
    var a = 1, b = 2;
    a = 1, b = 2;

    转化为：
    var a = 1;
    var b = 2;
    a = 1;
    b = 2;
 */

// 导入@babel/types模块以便使用其辅助函数
const types = require("@babel/types");

// 定义AST（抽象语法树）遍历时的行为
const traverse_ConditionalVariableDeclarator = {
  // 当遍历到变量声明（var, let, const）时执行
  VariableDeclaration(path) {
    // 处理变量声明，拆分可能存在的复合声明
    fixVariableDeclaration(path);
  },
  // 当遍历到表达式语句时执行
  ExpressionStatement(path) {
    // 处理赋值表达式，拆分可能存在序列表达式
    fixExpressionStatement(path);
  },
};

// 处理变量声明的函数
function fixVariableDeclaration(path) {
  let { parentPath, node } = path;
  if (parentPath.isFor()) {
    return;
  }

  // 获取变量声明的类型（var, let, const）和声明列表
  const { declarations, kind } = node;

  // 如果声明列表中的元素少于2，则无需处理，直接返回
  if (declarations.length < 2) return;

  // 遍历声明列表
  declarations.forEach((declaration) => {
    // 为每个声明创建新的变量声明节点
    const newDeclaration = types.variableDeclaration(kind, [declaration]);
    // 在当前节点之前插入新的变量声明
    path.insertBefore(newDeclaration);
  });

  // 移除原来的复合声明节点
  path.remove();
}

// 处理表达式语句的函数
function fixExpressionStatement(path) {
  // 获取表达式语句中的表达式部分
  const { expression } = path.node;

  // 如果这个表达式不是序列表达式，则无需处理，直接返回
  if (!types.isSequenceExpression(expression)) return;

  // 获取序列表达式中的所有表达式
  const { expressions } = expression;

  // 如果序列表达式中的表达式少于2，则无需处理，直接返回
  if (expressions.length < 2) return;

  // 遍历序列表达式中的表达式
  expressions.forEach((expr) => {
    // 为每个表达式创建新的表达式语句节点
    const newExpression = types.expressionStatement(expr);
    // 在当前节点之前插入新的表达式语句
    path.insertBefore(newExpression);
  });

  // 移除原来的序列表达式节点
  path.remove();
}

// 导出修复函数，便于外部模块调用
exports.fix = traverse_ConditionalVariableDeclarator;