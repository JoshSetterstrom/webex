const evaluate = (val, actual, expected) => {
    const operators = [">=", "<=", ">", "<", "!=="];
    
    const operator = operators.find(x => val.toString().includes(x));

    if (operator) actual = Number(actual);
    
    switch(operator) {
        case "!==": return { actual, expected, match: actual !== Number(expected.replace(operator, '').trim()) };
        case ">=": return { actual, expected, match: actual >= Number(expected.replace(operator, '').trim()) };
        case "<=": return { actual, expected, match: actual <= Number(expected.replace(operator, '').trim()) };
        case ">": return { actual, expected, match: actual > Number(expected.replace(operator, '').trim()) };
        case "<": return { actual, expected, match: actual < Number(expected.replace(operator, '').trim()) };
        default: return { actual, expected, match: actual.toString() === expected.toString() };
    };
};

export default evaluate;