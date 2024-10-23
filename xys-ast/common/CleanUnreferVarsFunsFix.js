/**
 * 删除未引用的函数和变量
 * 例子：
function a(num) {
  const ddd = 10;
  return num * 2;
}
function b(x, y) {
  return a(x + y);
}
function c(x, y) {
  return a(x) + b(x, y);
}
function tt() {
  const k = 10;
  const j = 28;
  const kk = k + j;
  return kk;
}
tt();
转化后：

function tt() {
  const k = 10;
  const j = 28;
  const kk = k + j;
  return kk;
}
tt();
 */

const types = require("@babel/types");

function containsSequenceExpression(path) {
  let containsSequence = false;
  // 深度优先遍历当前路径及其所有子路径
  path.traverse({
      "SequenceExpression|AssignmentExpression"(_path) {
          containsSequence = true;
          _path.stop(); // 找到逗号表达式后立即停止遍历
      },
  });
  return containsSequence;
}

const cleanUnreferVarsFuns = {
    "SequenceExpression"(path)
  {
      let {expressions} = path.node;
      let newExpressions = expressions.slice(0,-1);
      if (newExpressions.every(element => types.isLiteral(element)))
      {//可自己写判断函数代替isLiteral
          path.replaceWith(expressions.at(-1));
      }
  },
  "IfStatement|ConditionalExpression"(path) {
      let { consequent, alternate } = path.node;
      let testPath = path.get('test');

      if (testPath.isSequenceExpression() || testPath.isAssignmentExpression() ||
          containsSequenceExpression(testPath)) {//不处理逗号表达式，赋值语句防止误删

          return;
      }

      const evaluateTest = testPath.evaluateTruthy();
      if (evaluateTest === true) {
          if (types.isBlockStatement(consequent)) {
              consequent = consequent.body;
          }
          path.replaceWithMultiple(consequent);
          return;
      }
      if (evaluateTest === false) {
          if (alternate != null) {
              if (types.isBlockStatement(alternate)) {
                  alternate = alternate.body;
              }
              path.replaceWithMultiple(alternate);
          }
          else {
              path.remove();
          }
      }
  },
  "LogicalExpression"(path) {

      let { left, operator, right } = path.node;

      let leftPath = path.get('left');

      if (leftPath.isSequenceExpression() || leftPath.isAssignmentExpression() ||
      containsSequenceExpression(leftPath)) {//不处理逗号表达式，赋值语句防止误删
      return;
  }

      const evaluateLeft = leftPath.evaluateTruthy();

      if ((operator == "||" && evaluateLeft == true) ||
          (operator == "&&" && evaluateLeft == false)) {
          path.replaceWith(left);
          return;
      }
      if ((operator == "||" && evaluateLeft == false) ||
          (operator == "&&" && evaluateLeft == true)) {
          path.replaceWith(right);
      }
  },
  "EmptyStatement|DebuggerStatement"(path) {
      path.remove();
  },

  "VariableDeclarator"(path) {
      let { node, scope, parentPath, parent } = path;

      let ancestryPath = parentPath.parentPath;

      if (ancestryPath.isForOfStatement({ left: parent }) ||
          ancestryPath.isForInStatement({ left: parent })) {//目前发现这两个需要过滤
          return;
      }

      let { id, init } = node;

      if (!types.isIdentifier(id) || types.isCallExpression(init) ||
          types.isAssignmentExpression(init)) {//目前只发现赋值语句和调用语句会有问题。后续待添加
          return;
      }

      let binding = scope.getBinding(id.name);//重新解析ast后，一定会有binding;
      if(!binding)  return;

      let { referenced, constant, constantViolations } = binding;

      if (referenced || constantViolations.length > 1) {
          return;
      }

      if (constant || constantViolations[0] == path) {
          console.log(parentPath.toString());
          path.remove();
      }
  },

  "ContinueStatement|BreakStatement|ReturnStatement|ThrowStatement"(path) {
      let AllNextSiblings = path.getAllNextSiblings();  //获取所有的后续兄弟节点

      for (let nextSibling of AllNextSiblings) {

          if (nextSibling.isFunctionDeclaration() || nextSibling.isVariableDeclaration({ kind: "var" }))
          {//变量提升.....
              continue;
          }
          nextSibling.remove();
      }

  },

}


exports.fix = cleanUnreferVarsFuns; // 导出访问者模式
