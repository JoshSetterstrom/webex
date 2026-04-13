const flattenSingle = (obj, key="item") => {
    if (!obj || obj._error) return result;

    const arr = obj?.[key];

    if (!Array.isArray(arr)) return { _error: true, message: `Expected array at "${key}"` };
    if (arr.length === 0) return { _error: true, message: 'No results found' };
    if (arr.length > 1) return { _warning: true, message: `Expected 1 result, got ${arr.length}`, data: arr[0] };

    return arr[0];
};

export default flattenSingle;