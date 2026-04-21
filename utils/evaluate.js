const evaluate = (templateValue, actual, expected) => {    
    const [ _, operator, value ] = templateValue.toString().match(/^(>=|<=|!==|>|<)\s*(.+)$/) || [];

    if (!operator) return { actual, expected, match: actual.toString() === expected.toString() };

    const ops = {
        "!==": (x, y) => x !== y,
        ">=": (x, y) => x >= y,
        "<=": (x, y) => x <= y,
        ">": (x, y) => x > y,
        "<": (x, y) => x < y
    };

    return { actual, expected, match: ops[operator](Number(actual), Number(value)) };
};

export default evaluate;