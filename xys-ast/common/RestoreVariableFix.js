// #插件更新  变量定义语句初始化为常量(整个作用域不改变)时的还原

// 变量定义初始化为常量时的还原，该变量在其作用域内没有发生更改的时候，可以通过binding来进行还原。

// 新版babel库对循环体内的变量定义默认为 非常量,需要单独处理。

/********************************************************************
var a = 123;
var b = -5;
var c = String;
var d = String.fromCharCode;

function e()
{
  var f = c(123),g = d(0x31);
	return a + b + f ;
}

while(true)
{
  var h = 123;
  var i = 111;
  j = h + 456;
  i = i + 222;
}

===>

function e() {
  var f = String(123),
    g = String.fromCharCode(0x31);
  return 123 + -5 + f;
}
while (true) {
  var i = 111;
  j = 123 + 456;
  i = i + 222;
}

********************************************************************/

const types = require("@babel/types");

function isExpressionConstant(PathOrNode) {

    let node = PathOrNode.node || PathOrNode;

    let BrowList = ['window', 'document', 'navigator', 'location', 'history', 'screen',];

    if (types.isLiteral(node) && node.value != null) {
        return true;
    }

    if (types.isIdentifier(node) && BrowList.includes(node.name)) {
        return true;
    }

    if (types.isIdentifier(node) && typeof globalThis[node.name] != "undefined") {
        return true;
    }

    if (types.isMemberExpression(node)) {
        let { object, property } = node;

        if (types.isIdentifier(object) && typeof globalThis[object.name] != "undefined") {
            let properName = types.isIdentifier(property) ? property.name : property.value;
            if (typeof globalThis[object.name][properName] != "undefined") {
                return true;
            }
        }

        if (types.isMemberExpression(object)) {
            return isExpressionConstant(object);
        }

    }

    if (types.isUnaryExpression(node) && ["+", "-", "!", "typeof", "~"].includes(node.operator)) {
        return isExpressionConstant(node.argument);
    }

    return false;
}

const restoreVariableFix =
{
    VariableDeclarator(path) {
        let scope = path.scope;
        let { id, init } = path.node;

        if (!types.isIdentifier(id) || init == null || !isExpressionConstant(init)) {
            return;
        }

        const binding = scope.getBinding(id.name);

        if (!binding) return;

        let { constant, referencePaths, constantViolations } = binding;

        if (constantViolations.length > 1) {
            return;
        }

        if (constant || constantViolations[0] == path) {
            for (let referPath of referencePaths) {
                referPath.replaceWith(init);
            }
        }
    },
}
// 将处理函数 export 出去，这样其他模块可以引用
exports.fix = restoreVariableFix;