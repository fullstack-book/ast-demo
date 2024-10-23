// #插件更新  函数调用处替换计算值:     add(1,2) ==> 3

/********************************************************************
处理FunctionDeclaration
思路:对于实参全部是字面量的函数调用，且运行结果唯一时，可以进行替换
before:
function add(a,b)
{
	return a+b;
}
s = add(1,2) + add(111,222);
after:
function add(a, b) {
  return a + b;
}
s = 3 + 333;
********************************************************************/

const types = require("@babel/types");

const functionCalcFix = {

    FunctionDeclaration(path) {
        let { node, parentPath } = path;

        let { id, body, params } = node;

        if (params.length == 0 || !types.isReturnStatement(body.body.at(-1))) {
            return;
        }

        const binding = parentPath.scope.getBinding(id.name);

        if (!binding || !binding.constant)
            return;

        let sourceCode = path.toString();

        // if (sourceCode.includes("try") || sourceCode.includes("random") || sourceCode.includes("Date")) {
        //     //返回值不唯一不做处理
        //     return;
        // }

        try {
            //直接eval，如果缺环境，让其主动报错，再补上即可。下同,函数声明eval不会报错。
            globalThis[id.name] = eval(`(${sourceCode})`);

            let canRemoved = true;

            for (const referPath of binding.referencePaths) {
                let { parentPath, node } = referPath;
                if (!parentPath.isCallExpression({ "callee": node })) {
                    canRemoved = false;
                    continue;
                }

                const args = parentPath.get("arguments").map(arg => arg.evaluate().value);

                if (args.length == 0 || args.includes(undefined)) {
                    canRemoved = false;
                    continue;
                }

                let value = globalThis[id.name].apply(null, args); //计算结果
                if (typeof value == "function" || typeof value == "undefined") {
                    canRemoved = false;
                    continue;
                }
                console.log(parentPath.toString(), "-->", value);
                parentPath.replaceWith(types.valueToNode(value)); //替换
            }

            canRemoved && path.remove();

        } catch (e) { }

    },
}

exports.fix = functionCalcFix