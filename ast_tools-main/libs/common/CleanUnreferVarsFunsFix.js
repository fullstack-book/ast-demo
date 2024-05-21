const types = require("@babel/types");

const visitor = {
    "Program": {
        // 在进入程序时执行
        enter(path) {
            path.traverse({
                // 处理函数声明和变量声明
                "FunctionDeclaration|VariableDeclaration"(declarationPath) {
                    let name;
                    // 如果是函数声明，获取函数名
                    if (declarationPath.isFunctionDeclaration()) {
                        name = declarationPath.node.id.name;
                    } 
                    // 如果是变量声明，并且是单个变量，则获取变量名
                    else if (declarationPath.node.declarations.length === 1) {
                        // 变量声明可能包括多个变量，这里只处理单个变量的情况
                        const declaration = declarationPath.node.declarations[0];
                        if (types.isIdentifier(declaration.id)) {
                            name = declaration.id.name;
                        }
                    }
                    // 如果name被赋值则进行检查是否被引用
                    if (name) {
                        const binding = declarationPath.scope.getBinding(name);
                        // 如果没有被引用，则删除路径
                        if (binding && binding.references === 0) {
                            declarationPath.remove();
                        }
                    }
                }
            });
        }
    }
};

exports.fix = visitor;