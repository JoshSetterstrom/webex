const isPlainObject = value => value !== null && typeof value === "object" && !Array.isArray(value);
const isTraversable = value => value !== null && typeof value === "object";

const tokenizePath = path => {
	if (!path || typeof path !== "string") return [];

	return path
		.replace(/\[(\d+)\]/g, ".$1")
		.split(".")
		.filter(Boolean)
		.map(part => (/^\d+$/.test(part) ? Number(part) : part));
};

const getNestedValue = (obj, path) => {
	const tokens = tokenizePath(path);

	if (!tokens.length) return undefined;

	return tokens.reduce((acc, key) => acc?.[key], obj);
};

const sortResolvedData = (data, sort) => {
	if (!sort || !Array.isArray(data)) return data;

	return [...data].sort((a, b) => {
		const av = getNestedValue(a, sort);
		const bv = getNestedValue(b, sort);

		if (av == null && bv == null) return 0;
		if (av == null) return 1;
		if (bv == null) return -1;

		if (typeof av === "number" && typeof bv === "number") return av - bv;

		return String(av).localeCompare(String(bv));
	});
};

const applyResolveOptions = (result, resolve) => {
	let data;

	if (resolve.key) data = result?.[resolve.key];
	else data = result;

	return sortResolvedData(data, resolve.sort);
};

const resolveNode = async (client, collectedData, resolve) => {
	if (!resolve?.from || !resolve?.path) return { _error: true, message: "Invalid resolve config" };

	const value = getNestedValue(collectedData, resolve.from);

	if (value == null) return { _error: true, message: `Missing resolve value from "${resolve.from}"` };

	if (Array.isArray(value)) {
		const results = await Promise.all(
			value.map(async item => {
				const path = resolve.path.replace("{value}", encodeURIComponent(String(item)));
				const result = await client.get(path);

				return applyResolveOptions(result, resolve);
			})
		);

		return results;
	}

	const path = resolve.path.replace("{value}", encodeURIComponent(String(value)));
	const result = await client.get(path);

	return applyResolveOptions(result, resolve);
};

const resolveConfig = async (client, collectedData) => {
	const walk = async current => {
		if (!isTraversable(current)) return current;

		if (isPlainObject(current._resolve)) return resolveNode(client, collectedData, current._resolve);

		if (Array.isArray(current)) {
			const output = [];

			for (const value of current) output.push(await walk(value));

			return output;
		}

		const output = {};

		for (const [key, value] of Object.entries(current)) output[key] = await walk(value);

		return output;
	};

	return walk(collectedData);
};

export default resolveConfig;