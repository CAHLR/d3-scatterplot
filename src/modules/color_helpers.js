// Coloring helpers


// What is d referring to here? Data? can we come up with a better name?
export function cValue(d) {
	let key = "color_column";
	
	if (typeof color_column !== 'undefined') key = color_column;
	return d[key];
};
