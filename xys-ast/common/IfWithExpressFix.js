/**
 * 转化if语句中的consequent和alternate分支为BlockStatement类型，以解决consequent和alternate分支不是BlockStatement类型的问题。
源代码：
 
    if (a > b)
        console.log(a);
    else
        console.log(b);

 转化后：

    if (a > b) {
        console.log(a);
    } else {
        console.log(b);
    }
 * 
 */

// 引入babel类型，用于处理AST（抽象语法树）
const types = require("@babel/types");

// 创建一个包含IfStatement处理器的对象，用于遍历AST中的if语句
const traverse_ifexpress = {
    IfStatement(path) {
        // 当遇到IfStatement节点时，调用fix函数进行处理
        fix(path);
    }
}

// 定义fix函数，用于转化if语句中的分支为BlockStatement类型
function fix(path) {
    // 从路径中获取当前节点
    const node = path.node;

    // 检查当前节点是否为if语句
    if (types.isIfStatement(node)) {
        // 处理consequent分支（if的主体部分）
        // 检查consequent是否不是BlockStatement类型
        if (!types.isBlockStatement(node.consequent)) {
            // 如果consequent不是BlockStatement类型，则将其包裹在BlockStatement中
            // .filter(Boolean)用于过滤null值，确保数组中不包含空值
            node.consequent = types.blockStatement([node.consequent].filter(Boolean));
        }
        
        // 处理alternate分支（if的else部分）
        // 首先检查alternate是否存在，且不是BlockStatement类型
        if (node.alternate && !types.isBlockStatement(node.alternate)) {
            // 如果alternate存在且不是BlockStatement类型，则将其包裹在BlockStatement中
            // 同样使用.filter(Boolean)过滤掉数组中的null值
            node.alternate = types.blockStatement([node.alternate].filter(Boolean));
        }
    }
}

// 导出traverse_ifexpress，以便在AST遍历中使用
exports.fix = traverse_ifexpress