/**********************************************
一键解ob混淆插件更新
原插件名:preDecodeObject
先插件名:combinObjectProperty

插件功能:
处理前:

var N = {};
N['pjJaj'] = function(O, P) {
    return O !== P;
};
N['kchUv'] = b('0', 'kG%a');
N['pUSwg'] = b('1', '6gEI');
N['ckVCQ'] = function(Q, R) {
    return Q !== R;
};
N['AgHaJ'] = b('2', '4fPv');
N['VtmkW'] = b('3', 'N6]X');

处理后:
var N = {
  'pjJaj': function (O, P) {
    return O !== P;
  },
  'kchUv': b('0', 'kG%a'),
  'pUSwg': b('1', '6gEI'),
  'ckVCQ': function (Q, R) {
    return Q !== R;
  },
  'AgHaJ': b('2', '4fPv'),
  'VtmkW': b('3', 'N6]X')
};
**********************************************/

const types = require("@babel/types");

const MergeObjectPropertiesFix = {
    VariableDeclarator({ node, parentPath, scope }) {
        const { id, init } = node;
        if (!types.isObjectExpression(init)) return;
        let name = id.name;

        let properties = init.properties;
        let allNextSiblings = parentPath.getAllNextSiblings();
        for (let nextSibling of allNextSiblings) {
            if (!nextSibling.isExpressionStatement()) break;

            let expression = nextSibling.get('expression');
            if (!expression.isAssignmentExpression({ operator: "=" })) break;

            let { left, right } = expression.node;
            if (!types.isMemberExpression(left)) break;

            let { object, property } = left;
            if (!types.isIdentifier(object, { name: name }) ||
                !types.isStringLiteral(property)) {
                break;
            }

            properties.push(types.ObjectProperty(property, right));
            nextSibling.remove();
        }
        scope.crawl();
    },
}

// 将处理函数 export 出去，这样其他模块可以引用
exports.fix = MergeObjectPropertiesFix;