const types = require("@babel/types");

const traverse_refactored = {
    CallExpression(path) {
        replaceVariable(path);
    }
};

const replaceVariable = (path) => {
    const { node } = path;


}


exports.fix = traverse_refactored;