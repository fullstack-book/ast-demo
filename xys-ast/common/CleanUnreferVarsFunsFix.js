/**
 * 删除未引用的函数和变量
 */

const types = require("@babel/types");

// 移除未引用的函数和变量
function removeUnused(path) {
  let hasRemoved = false; // 标记是否有移除的节点

  // 遍历函数声明
  path.traverse({
    FunctionDeclaration(path) {
      const name = path.node.id.name; // 获取函数名称
      const binding = path.scope.getBinding(name); // 获取该名称的绑定信息
      // 如果函数没有被引用，移除该函数
      if (binding && !binding.referenced) {
        path.remove();
        hasRemoved = true; // 标记已移除
      }
    },
    // 遍历变量声明
    VariableDeclaration(path) {
      // 遍历每个声明器（declarator）
      path.node.declarations.forEach((declarator) => {
        if (types.isIdentifier(declarator.id)) {
          // 检查是否为标识符
          const name = declarator.id.name; // 获取变量名
          const binding = path.scope.getBinding(name); // 获取该名称的绑定信息
          // 如果变量没有被引用，将其标记为null
          if (binding && !binding.referenced) {
            declarator.id = null; // 将未引用的标识符设为null
            hasRemoved = true; // 标记已移除
          }
        }
      });

      // 清理掉已标记为null的声明器
      path.node.declarations = path.node.declarations.filter(
        (declarator) => declarator.id !== null
      );
      // 如果所有的变量声明都被移除了，那么移除整个VariableDeclaration节点
      if (path.node.declarations.length === 0) {
        path.remove();
        hasRemoved = true; // 标记已移除
      }
    },
  });

  return hasRemoved; // 返回是否有节点被移除
}

// 访问者模式定义
const visitor = {
  Program(path) {
    let hasRemoved;
    do {
      hasRemoved = removeUnused(path); // 调用移除函数
      path.scope.crawl(); // 更新作用域信息，确保引用状态被正确识别
    } while (hasRemoved); // 继续循环，直到没有更多未引用的节点
  },
};

exports.fix = visitor; // 导出访问者模式
