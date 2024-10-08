const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");

/**
 * 恢复对象表达式中的属性引用
 * @param {Object} ast - AST 树
 * @returns {Object} - 更新后的 AST
 */
function restoreObjExpression(ast) {
    traverse(ast, {
        VariableDeclarator(path) {
            const node = path.node;
            if (!t.isObjectExpression(node.init)) return;

            const objPropertiesList = node.init.properties;
            if (objPropertiesList.length === 0) return;

            const objName = node.id.name;
            const binding = path.scope.getBinding(objName);
            if (!binding || !binding.constant) return;

            const paths = binding.referencePaths;
            paths.forEach((referPath) => {
                const referParentPath = referPath.parentPath;
                const referParentNode = referParentPath.node;
                if (!t.isMemberExpression(referParentNode)) return;

                const propValue = referParentNode.property.value;
                let objValue;

                for (const prop of objPropertiesList) {
                    if (prop.key.value === propValue) {
                        objValue = prop.value;
                        if (t.isLiteral(objValue)) {
                            referParentPath.replaceWith(objValue);
                        } else if (t.isMemberExpression(objValue)) {
                            referParentPath.replaceWith(objValue);
                        } else if (t.isFunctionExpression(objValue)) {
                            // 处理函数表达式
                            const args = referParentPath.parentPath.node.arguments;
                            const paramsName = objValue.params;
                            const retBody = objValue.body.body;

                            if (retBody.length === 1) {
                                const returnStatement = retBody[0];
                                const tempAst = parser.parse(generator(returnStatement.argument).code);
                                
                                // 替换形参
                                for (let j = 0; j < Math.min(paramsName.length, args.length); j++) {
                                    const name = paramsName[j].name;
                                    traverse(tempAst, {
                                        Identifier(p) {
                                            if (p.node.name === name) {
                                                p.replaceWith(args[j]);
                                            }
                                        }
                                    });
                                }
                                referParentPath.replaceWith(tempAst.program.body[0].expression);
                            }
                        }
                        break;
                    }
                }
            });
        },
        AssignmentExpression(path) {
            const node = path.node;
            if (!t.isObjectExpression(node.right)) return;

            const objPropertiesList = node.right.properties;
            if (objPropertiesList.length === 0) return;

            const objName = node.left.name;
            const binding = path.scope.getBinding(objName);
            if (!binding || binding.constantViolations.length > 1) return;

            const paths = binding.referencePaths;
            paths.forEach((referPath) => {
                const referParentPath = referPath.parentPath;
                const referParentNode = referParentPath.node;
                if (!t.isMemberExpression(referParentNode)) return;

                const propValue = referParentNode.property.value;
                let objValue;

                for (const prop of objPropertiesList) {
                    if (prop.key.value === propValue) {
                        objValue = prop.value;
                        if (t.isLiteral(objValue)) {
                            referParentPath.replaceWith(objValue);
                        } else if (t.isMemberExpression(objValue)) {
                            referParentPath.replaceWith(objValue);
                        } else if (t.isFunctionExpression(objValue)) {
                            // 处理函数表达式
                            const args = referParentPath.parentPath.node.arguments;
                            const paramsName = objValue.params;
                            const retBody = objValue.body.body;

                            if (retBody.length === 1) {
                                const returnStatement = retBody[0];
                                const tempAst = parser.parse(generator(returnStatement.argument).code);

                                for (let j = 0; j < Math.min(paramsName.length, args.length); j++) {
                                    const name = paramsName[j].name;
                                    traverse(tempAst, {
                                        Identifier(p) {
                                            if (p.node.name === name) {
                                                p.replaceWith(args[j]);
                                            }
                                        }
                                    });
                                }
                                referParentPath.replaceWith(tempAst.program.body[0].expression);
                            }
                        }
                        break;
                    }
                }
            });
        }
    });

    // 更新 AST
    return parser.parse(generator(ast).code);
}

// 使用示例
const originalCode = `
let obj1 = {
    "aaa": "111",
    "bbb": function(a, b, c) { return a(b, c); },
    "ccc": function(a, b, c) { return a + b + c; },
    "ddd": function(a, b) { return a | b; },
    "eee": 666
};

let a = obj1["aaa"];
let b = obj1["bbb"](obj1["ddd"], 10, 20);
console.log(a, b);
`;

const ast = parser.parse(originalCode);
const updatedAst = restoreObjExpression(ast);
const modifiedCode = generator(updatedAst).code;
console.log(modifiedCode);
