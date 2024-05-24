const types = require("@babel/types");

const visitor = {
    FunctionDeclaration(path) {
        let name =  path.node.id.name;
        if (name) {
            const binding = path.scope.getBinding(name);
            if (binding && !binding.referenced) {
                path.remove();
            }
        }
    },
    VariableDeclaration(path) {
        // 遍历变量声明中的每个声明器（declarator）
        path.node.declarations.forEach((declarator) => {
            if (types.isIdentifier(declarator.id)) {
                // 获取变量名
                let name = declarator.id.name;
                // 检查变量是否被引用
                const binding = path.scope.getBinding(name);
                if (binding && !binding.referenced) {
                    // 如果未被引用，将该声明器标记为null（稍后移除）
                    declarator.id = null;
                }
            }
        });

        // 清理掉已标记为null的声明器
        path.node.declarations = path.node.declarations.filter(declarator => declarator.id !== null);

        // 如果所有的变量声明都被移除了，那么移除整个VariableDeclaration节点
        if (path.node.declarations.length === 0) {
            path.remove();
        }
    }
};

exports.fix = visitor;