/**
 * 修复for循环语句中的表达式问题，确保循环体的语句被{}包裹。
 *  例如
    for (let i = 0; i < 10; i++) console.log(i);
    转换为:
    for (let i = 0; i < 10; i++) {
        console.log(i);
    }
 */

// 引入@babel/types模块以便处理和构造AST（抽象语法树）节点
const types = require("@babel/types");

// 定义一个包含ForStatement节点处理逻辑的对象
const traverse_forexpress = {
  // 当遍历到ForStatement类型的节点时，会调用fix函数
  ForStatement(path) {
    fix(path);
  },
};

// 定义一个处理ForStatement节点的函数
function fix(path) {
  // 从path中获取当前遍历到的节点
  const node = path.node;

  // 检查当前节点是否为ForStatement类型，且它的body属性不是BlockStatement类型
  // types.isForStatement(node)用于确认节点是不是ForStatement类型
  // !types.isBlockStatement(node.body)用于确认循环体不是一个代码块（即没有被{}包裹）
  if (types.isForStatement(node) && !types.isBlockStatement(node.body)) {
    // 如果循环体不是代码块，则创建一个新的BlockStatement节点，
    // 并将原有的循环体作为唯一的语句放入这个代码块中
    // 这样做可确保循环体即使是单条语句也被{}包裹，提高代码的可读性和一致性
    path.node.body = types.blockStatement([node.body]);
  }
}

// 导出traverse_forexpress模块，让其他文件可以通过require引入并使用这个转换逻辑
exports.fix = traverse_forexpress;
