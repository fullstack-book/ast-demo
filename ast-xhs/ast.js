const fs = require('fs');
const parser = require('@babel/parser');
const types = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const jscode = fs.readFileSync('x-s-common2.js', 'utf-8');


const ast = parser.parse(jscode, { sourceType: 'module' });

const newAst = parser.parse("");
newAst.program.body.push(ast.program.body[0]);
newAst.program.body.push(ast.program.body[1]);
newAst.program.body.push(ast.program.body[2]);
newAst.program.body.push(ast.program.body[3]);

const newAstCode = generate(newAst, { compact: true }).code;

eval(newAstCode);

let definitionsMap = new Map(); // 存储变量名与其定义节点的映射
let functionNames = []; // 存储函数名
let functionString = ''; // 存储函数字符串

let visitor = {
    VariableDeclarator(path) {
        const varName = path.node.id.name;
        definitionsMap.set(varName, path.node.init); // 只存储初始化部分
    },
    FunctionDeclaration(path) {
        if (path.node.id.name === 'G') {
            let localVars = new Set();
            let functionParameters = new Set();
            let externalVars = new Set();

            path.node.params.forEach((param) => {
                functionParameters.add(param.name);
            });

            path.traverse({
                VariableDeclarator(innerPath) {
                    localVars.add(innerPath.node.id.name);
                }
            });

            path.traverse({
                Identifier(innerPath) {
                    const isFunctionCall = innerPath.parentPath.isCallExpression() && 
                        innerPath.parentPath.get("callee") === innerPath;

                    if (
                        !functionParameters.has(innerPath.node.name) &&
                        !localVars.has(innerPath.node.name) && 
                        innerPath.key !== 'id' && 
                        !isFunctionCall
                    ) {
                        externalVars.add(innerPath.node.name); // 添加可能的外部变量
                    }
                }
            });

            console.log(`External variables in function 'd' are: ${[...externalVars].join(', ')}`);
            
            for (let extVar of externalVars) { 
                let definitionNode = definitionsMap.get(extVar);
                if (definitionNode) {
                    // 使用var进行声明
                    const constDeclaration = types.variableDeclaration('var', [types.variableDeclarator(types.identifier(extVar), definitionNode)]);
                    path.get('body').unshiftContainer('body', constDeclaration);
                }
            }

            // 将函数名和函数字符串添加到函数名集合和函数字符串变量中
            functionNames.push(path.node.id.name);
            functionString += generate(path.node).code;
        }
    }
};

traverse(ast, visitor);

eval(functionString);

let visitor2 = {
    FunctionDeclaration(path) {
        // 获取函数名
        const funcName = path.get('id').node.name;

        if (funcName === "G") {
            const bindings = path.scope.getBinding(funcName);

            // 遍历所有绑定
            if (bindings) {
                bindings.referencePaths.forEach(refPath => {
                    if (refPath.parentPath.isCallExpression()) {
                        // 获取调用函数的参数
                        const calcValue = types.stringLiteral(eval(refPath.parentPath.toString()));
                        refPath.parentPath.replaceWith(calcValue);
                    }
                });
            }
        }
    }
};

traverse(ast, visitor2);

const { code } = generate(ast);
fs.writeFileSync('newDemo.js', code, 'utf-8');
